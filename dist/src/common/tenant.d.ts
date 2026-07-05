export type RequestUser = {
    sub: string;
    role: string;
    schoolId?: string | null;
};
export declare function tenantWhere(user: RequestUser, requestedSchoolId?: string | null): {
    schoolId?: undefined;
} | {
    schoolId: string | undefined;
};
