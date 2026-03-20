import { AuditLog } from "../models";

interface LogActionParams {
  userId: number;
  action: string;
  entityType: string;
  entityId: number;
  performedBy: number;
}

const logAction = async ({
  userId,
  action,
  entityType,
  entityId,
  performedBy,
}: LogActionParams): Promise<void> => {
  await AuditLog.create({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    performed_by: performedBy,
    timestamp: new Date(),
  });
};

export { logAction };