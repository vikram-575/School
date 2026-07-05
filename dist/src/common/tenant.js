"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantWhere = tenantWhere;
function tenantWhere(user, requestedSchoolId) {
    if (user.role === 'SUPER_ADMIN') {
        return requestedSchoolId ? { schoolId: requestedSchoolId } : {};
    }
    return { schoolId: user.schoolId ?? undefined };
}
//# sourceMappingURL=tenant.js.map