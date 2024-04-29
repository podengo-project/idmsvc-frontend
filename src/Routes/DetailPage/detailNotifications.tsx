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
