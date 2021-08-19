type User = {
  permissions: string[];
  roles: string[];
};

type ValidationUserPermissionsParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
};

export function validateUserPermissions({
  user,
  permissions,
  roles,
}: ValidationUserPermissionsParams) {
  console.log("--------------------------------------------------");
  console.log(user, permissions, roles);

  if (permissions?.length > 0) {
    // Checando se o user tem todas as permissões
    const hasAllPermissions = permissions.every((permissions) =>
      user.permissions.includes(permissions)
    );

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    // Checando se o user tem todas as roles
    const hasAllRoles = roles.some((role) => user.roles.includes(role));

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
