import { Middleware, Store } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import logger from 'redux-logger';

import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let registry: any;

export const restoreStore = () => {
  registry = undefined;
};

export function initStore(): Store {
  if (registry) {
    throw new Error('store already initialized');
  }

  const middleware: Middleware[] = [promiseMiddleware];
  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger);
  }
  registry = getRegistry({}, middleware);
  registry.register({ notifications: notificationsReducer });
  return registry.getStore();
}
