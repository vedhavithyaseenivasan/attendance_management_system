"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAction = void 0;
const models_1 = require("../models");
const logAction = async ({ userId, action, entityType, entityId, performedBy, }) => {
    await models_1.AuditLog.create({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        performed_by: performedBy,
        timestamp: new Date(),
    });
};
exports.logAction = logAction;
