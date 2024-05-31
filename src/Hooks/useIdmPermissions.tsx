import { useEffect, useMemo, useState } from 'react';
import { UsePermissionsState, doesHavePermissions, getRBAC } from '@redhat-cloud-services/frontend-components-utilities/RBAC';

const APP = 'idmsvc';

export interface IdmPermissions {
  isLoading: boolean;
  permissions: {
    hasTokenCreate: boolean | undefined;
    hasDomainsRead: boolean | undefined;
    hasDomainsList: boolean | undefined;
    hasDomainsUpdate: boolean | undefined;
    hasDomainsDelete: boolean | undefined;
  };
}

/**
 * @returns useIdmPermissions encapsulate the permissions for
 * domain integration service.
 */
const useIdmPermissions = (): IdmPermissions => {
  const tokenCreate = APP + ':token:create';
  const domainsRead = APP + ':domains:read';
  const domainsUpdate = APP + ':domains:update';
  const domainsDelete = APP + ':domains:delete';
  const domainsList = APP + ':domains:list';

  const [permissions, setPermissions] = useState<UsePermissionsState>({
    isLoading: true,
    hasAccess: false,
    isOrgAdmin: false,
    permissions: [],
  });

  useEffect(() => {
    (async () => {
      // setPermissions((prev) => ({ ...prev, isLoading: true }));

      const { isOrgAdmin, permissions: userPermissions } = await getRBAC(APP);

      setPermissions({
        isLoading: false,
        isOrgAdmin,
        permissions: userPermissions,
        hasAccess: false,
      });
    })();
  }, []);

  const idmPermissions = useMemo(() => {
    return {
      isLoading: permissions.isLoading,
      permissions: {
        hasTokenCreate: doesHavePermissions(permissions.permissions, [tokenCreate], false),
        hasDomainsRead: doesHavePermissions(permissions.permissions, [domainsRead], false),
        hasDomainsList: doesHavePermissions(permissions.permissions, [domainsList], false),
        hasDomainsUpdate: doesHavePermissions(permissions.permissions, [domainsUpdate], false),
        hasDomainsDelete: doesHavePermissions(permissions.permissions, [domainsDelete], false),
      },
    };
  }, [permissions]);

  return idmPermissions;
};

export default useIdmPermissions;
