// activityLogger(action, options): a middleware FACTORY that records what users do in the Activity collection.
//
// How it works
//   1. Put it in a route chain after auth / the access middleware and before the controller:
//        router.put('/:taskId', activityLogger('task.updated'), updateTask);
//   2. Before the controller runs it optionally preloads data that will be gone afterwards:
//        options.preload = 'task'  loads the task's title (needed for deletes and comments)
//        options.preload = 'user'  loads the name of the user in req.params.userId or req.body.userId
//   3. It wraps res.json so it can read the body the controller sends (the response itself is unchanged).
//   4. When the response has been SENT ('finish'), and only if the status is 2xx, it builds a message with
//      utils/activityMessages.js and saves an Activity { project, task, actor, action, message }.
//      Failed requests (400 and up) log nothing.
//   Logging never affects the request: it runs after the response, and every error is caught and reduced to
//   one short console line.
//
//   options.statusChange = true  for the archive / reactivate route: the message uses the new status from the response.
//
// Wiring comments (M4.2, in the comments route chain, after the access middleware):
//   router.post('/', activityLogger('comment.added', { preload: 'task' }), createComment);
import Activity from '../models/Activity.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { activityMessages } from '../utils/activityMessages.js';

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;
const isId = (value) => typeof value === 'string' && OBJECT_ID_PATTERN.test(value);

const preloaders = {
  task: async (params) => {
    if (!isId(params.taskId)) return null;
    const filter = { _id: params.taskId };
    if (isId(params.projectId)) filter.project = params.projectId;
    return Task.findOne(filter).select('title');
  },
  user: async (params, body) => {
    const id = params.userId ?? body?.userId;
    return isId(id) ? User.findById(id).select('name') : null;
  },
};

// Works out what to save from what we captured; returns null when there is not enough to log.
const buildRecord = ({ action, options, project, params, actor, data, preloaded }) => {
  const projectId = project?._id ?? (isId(params.projectId) ? params.projectId : null) ?? (action === 'project.created' ? data?._id : null);
  if (!projectId || !actor) return null;

  const record = { project: projectId, actor, action };

  // Only task and comment actions point at a task. A deleted task no longer exists, so that one is left unset.
  if (action !== 'task.deleted' && (action.startsWith('task.') || action.startsWith('comment.'))) {
    const taskId = params.taskId ?? (action === 'task.created' ? data?._id : null);
    if (taskId) record.task = taskId;
  }

  record.message = activityMessages[action]({
    name: action === 'project.created' ? data?.name : preloaded?.name,
    title: ['task.deleted', 'comment.added'].includes(action) ? preloaded?.title : data?.title,
    status: options.statusChange || action === 'task.status_changed' ? data?.status : undefined,
  });
  return record;
};

const activityLogger = (action, options = {}) => {
  if (!activityMessages[action]) throw new Error(`activityLogger: unknown action "${action}"`);

  return async (req, res, next) => {
    // Copy what we need now: req.params and friends can change by the time the response finishes
    const { project, user } = req;
    const params = { ...req.params };
    const actor = user?._id;
    let captured;
    let preloaded = null;

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      captured = body;
      return originalJson(body);
    };

    res.on('finish', () => {
      if (res.statusCode < 200 || res.statusCode >= 300) return;
      Promise.resolve()
        .then(async () => {
          const record = buildRecord({ action, options, project, params, actor, data: captured?.data, preloaded });
          if (record) await Activity.create(record);
        })
        .catch((error) => console.error(`activityLogger: could not log ${action}: ${String(error.message).slice(0, 120)}`));
    });

    try {
      if (options.preload && preloaders[options.preload]) preloaded = await preloaders[options.preload](params, req.body);
    } catch (error) {
      console.error(`activityLogger: could not preload ${options.preload}: ${String(error.message).slice(0, 120)}`);
    }

    next();
  };
};

export default activityLogger;
