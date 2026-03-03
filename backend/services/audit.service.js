const { AuditLog } = require("../models");

const logAction = async ({ userId, action, entityType, entityId, performedBy }) => {
  await AuditLog.create({
    user_id: userId,        
    action,                
    entity_type: entityType,
    entity_id: entityId,   
    performed_by: performedBy, 
    timestamp: new Date()
  });
};

module.exports = { logAction };