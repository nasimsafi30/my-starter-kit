export type Role = "admin" | "moderator" | "user";

const roleHierarchy: Record<Role, number> = {
  admin: 3,
  moderator: 2,
  user: 1,
};

export function hasRole(userRole: string | undefined, requiredRole: Role): boolean {
  if (!userRole) return false;
  return (roleHierarchy[userRole as Role] || 0) >= roleHierarchy[requiredRole];
}

export function canAccess(userRole: string | undefined, requiredRoles: Role[]): boolean {
  if (!userRole) return false;
  return requiredRoles.some(role => hasRole(userRole, role));
}

export function isAdmin(role?: string): boolean {
  return role === "admin";
}

export function isModeratorOrAbove(role?: string): boolean {
  return hasRole(role, "moderator");
}
