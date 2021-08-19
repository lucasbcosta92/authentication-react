// Controle de acesso/permissões -> Retorna se o user pode ou não fazer algo

import { useContext } from "react";
import { AuthContexts } from "../contexts/AuthContexts";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContexts);

  if (!isAuthenticated) {
    return false;
  }

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
