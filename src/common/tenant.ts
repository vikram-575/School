export type RequestUser = {
  sub: string;
  role: string;
  schoolId?: string | null;
};

export function tenantWhere(user: RequestUser, requestedSchoolId?: string | null) {
  if (user.role === 'SUPER_ADMIN') {
    return requestedSchoolId ? { schoolId: requestedSchoolId } : {};
  }

  return { schoolId: user.schoolId ?? undefined };
}
