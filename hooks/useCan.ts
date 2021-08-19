// Controle de acesso/permissões -> Retorna se o user pode ou não fazer algo

import { useContext } from "react";
import { AuthContexts } from "../contexts/AuthContexts";
import { validateUserPermissions } from "../utils/validationUserPermissions";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContexts);

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
}
