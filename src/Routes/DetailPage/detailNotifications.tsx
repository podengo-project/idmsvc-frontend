import React from 'react';

import { Domain } from '../../Api/api';
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
