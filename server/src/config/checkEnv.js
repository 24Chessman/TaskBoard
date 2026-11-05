// checkProductionEnv(env): the list of problems that would make a production start unsafe or useless, as messages
// that name the variable but never print its value. An empty list means the environment is fine.
const MIN_SECRET_LENGTH = 32;
const PLACEHOLDER = /^(your|change|replace|secret|placeholder|example|test)/i;

const checkProductionEnv = (env) => {
  const problems = [];
  if (!env.MONGO_URI) problems.push('MONGO_URI is not set');

  const secret = env.JWT_SECRET;
  if (!secret) problems.push('JWT_SECRET is not set');
  else if (secret.length < MIN_SECRET_LENGTH) problems.push(`JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters`);
  else if (PLACEHOLDER.test(secret)) problems.push('JWT_SECRET looks like a placeholder: use a long random value');
  return problems;
};

export default checkProductionEnv;
