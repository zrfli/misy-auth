export const Roles = {
    ADMIN: 'ADMIN',
    ACADEMICIAND: 'ACADEMICIAND',
    STUDENT: 'STUDENT',
};

export const canAccess = (role: string, allowedRoles: string[]) => {
    return allowedRoles.includes(role);
};