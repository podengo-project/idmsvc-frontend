import React from 'react';

import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { Button, PageSection } from '@patternfly/react-core';

/**
 * A Component to show when user doesn't have RBAC permissions for the page.
 */
const NoPermissions = () => {
  const linkMyUserAccess = '/iam/my-user-access';

  return (
    <PageSection className="noPermissions">
      <NotAuthorized
        serviceName="Directory and Domain"
        showReturnButton
        title="Access permissions needed"
        description={
          <>
            To access identity domains, contact your organization <br />
            administrator. Aternatively, visit
            <br />
            <Button component="a" variant="link" isInline iconPosition="right" href={linkMyUserAccess} ouiaId="LinkNoPermissionsMyUserAccess">
              My User Access
            </Button>{' '}
            to learn more about your permissions.
          </>
        }
      />
    </PageSection>
  );
};

export default NoPermissions;
