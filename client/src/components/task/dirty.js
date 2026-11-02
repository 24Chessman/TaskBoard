// shouldConfirmDiscard({ formDirty, commentDirty }): true when closing the task drawer would throw away typed text
// (an edited task form, a comment being written or a comment being edited), so the drawer asks first.
export const shouldConfirmDiscard = ({ formDirty = false, commentDirty = false } = {}) => Boolean(formDirty || commentDirty);
