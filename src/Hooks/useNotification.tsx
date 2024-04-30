import { AlertVariant } from '@patternfly/react-core';
import { addNotification, removeNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import React from 'react';
import { useDispatch } from 'react-redux';

export interface NotificationPayload {
  title: React.ReactNode | string;
  variant?: AlertVariant;
  description?: React.ReactNode | string;
  id?: string | number;
  dismissable?: boolean;
}

export default function useNotification() {
  const dispatch = useDispatch();
  const notify = (payload: NotificationPayload & { variant: AlertVariant }) => dispatch(addNotification(payload));

  const notifyError = (payload: NotificationPayload) => notify({ variant: AlertVariant.danger, ...payload });

  const notifySuccess = (payload: NotificationPayload) => notify({ variant: AlertVariant.success, ...payload });

  const notifyWarning = (payload: NotificationPayload) => notify({ variant: AlertVariant.warning, ...payload });

  const remove = (id: string | number) => dispatch(removeNotification(id));

  return { notify, notifyError, notifySuccess, notifyWarning, removeNotification: remove };
}
