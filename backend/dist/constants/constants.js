"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Roles = exports.LeaveStatus = void 0;
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["APPLIED"] = "APPLIED";
    LeaveStatus["APPROVED"] = "APPROVED";
    LeaveStatus["REJECTED"] = "REJECTED";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
var Roles;
(function (Roles) {
    Roles["TEAM_MEMBER"] = "TEAM_MEMBER";
    Roles["LEAD"] = "LEAD";
    Roles["MANAGER"] = "MANAGER";
    Roles["HR"] = "HR";
})(Roles || (exports.Roles = Roles = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
})(Status || (exports.Status = Status = {}));
