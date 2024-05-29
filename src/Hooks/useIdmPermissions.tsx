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
  const tokenCreate = APP + ':token:create';
  const domainsRead = APP + ':domains:read';
  const domainsUpdate = APP + ':domains:update';
  const domainsDelete = APP + ':domains:delete';
  const domainsList = APP + ':domains:list';

  const { hasAccess: hasTokensCreate, isLoading: isLoadingTokensCreate } = usePermissions(APP, [tokenCreate], true, true);
  const { hasAccess: hasDomainsRead, isLoading: isLoadingDomainsRead } = usePermissions(APP, [domainsRead], true, true);
  const { hasAccess: hasDomainsUpdate, isLoading: isLoadingDomainsUpdate } = usePermissions(APP, [domainsUpdate], true, true);
  const { hasAccess: hasDomainsDelete, isLoading: isLoadingDomainsDelete } = usePermissions(APP, [domainsDelete], true, true);
  const { hasAccess: hasDomainsList, isLoading: isLoadingDomainsList } = usePermissions(APP, [domainsList], true, true);

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
