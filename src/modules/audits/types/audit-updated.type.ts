export type TAuditUpdatedPayload = {
  auditable: string;
  auditableId: string;
  previous: Record<string, any>;
  incoming: Record<string, any>;
  username: string;
  userId: string;
};
