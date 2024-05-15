import React from 'react';

import { Domain } from '../../Api/idmsvc';
import { NotificationPayload } from '../../Hooks/useNotification';

export const buildDescriptionEditSuccessNotification = (): NotificationPayload => {
  return { title: 'Identity domain description edited.' };
};

export const buildDescriptionEditFailedNotification = (): NotificationPayload => {
  return { title: 'Identity domain description could not be edited.' };
};

export const buildTitleEditSuccessNotification = (): NotificationPayload => {
  return { title: 'Identity domain title edited.' };
};

export const buildTitleEditFailedNotification = (): NotificationPayload => {
  return { title: 'Identity domain title could not be edited.' };
};

export const buildDeleteSuccessNotification = (domain?: Domain): NotificationPayload => {
  return {
    title: (
      <>
        Domain <i>{domain?.title}</i> deleted successfully.
      </>
    ),
  };
};

export const buildDeleteFailedNotification = (domain?: Domain): NotificationPayload => {
  return {
    title: (
      <>
        Failed to delete domain <i>{domain?.title}</i>
      </>
    ),
  };
};

export const buildAutoJoinToggleSuccessNotification = (domain?: Domain): NotificationPayload => {
  return {
    title: (
      <>
        Domain auto-join for <i>{domain?.title}</i> updated successfully.
      </>
    ),
  };
};

export const buildAutoJoinToggleFailedNotification = (domain?: Domain): NotificationPayload => {
  return {
    title: (
      <>
        Failed to update domain auto-join for <i>{domain?.title}.</i>
      </>
    ),
  };
};
