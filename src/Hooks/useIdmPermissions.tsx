import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

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
  const { hasAccess: hasTokensCreate, isLoading: isLoadingTokensCreate } = usePermissions(APP, [APP + ':token:create'], false, true);
  const { hasAccess: hasDomainsRead, isLoading: isLoadingDomainsRead } = usePermissions(APP, [APP + ':domains:read'], false, true);
  const { hasAccess: hasDomainsUpdate, isLoading: isLoadingDomainsUpdate } = usePermissions(APP, [APP + ':domains:update'], false, true);
  const { hasAccess: hasDomainsDelete, isLoading: isLoadingDomainsDelete } = usePermissions(APP, [APP + ':domains:delete'], false, true);
  const { hasAccess: hasDomainsList, isLoading: isLoadingDomainsList } = usePermissions(APP, [APP + ':domains:list'], false, true);

  const isLoading: boolean =
    isLoadingTokensCreate || isLoadingDomainsRead || isLoadingDomainsUpdate || isLoadingDomainsDelete || isLoadingDomainsList;

  return {
    isLoading: isLoading,
    permissions: {
      hasTokenCreate: hasTokensCreate,
      hasDomainsRead: hasDomainsRead,
      hasDomainsList: hasDomainsList,
      hasDomainsUpdate: hasDomainsUpdate,
      hasDomainsDelete: hasDomainsDelete,
    },
  };
};

export default useIdmPermissions;
