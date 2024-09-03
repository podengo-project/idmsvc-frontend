import React, { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { Button, Icon, Stack, StackItem, TextContent } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import { PendingIcon } from '@patternfly/react-icons/dist/js/icons/pending-icon';

import './VerifyRegistry.scss';
import { Domain, ResourcesApiFactory } from '../../../../Api/idmsvc';

/* Common definitions */

export type VerifyState = 'initial' | 'waiting' | 'timed-out' | 'not-found' | 'completed';

/* VerifyRegistryIcon component */

interface VerifyRegistryIconProps {
  state: VerifyState;
}

const VerifyRegistryIcon = (props: VerifyRegistryIconProps) => {
  return (
    <>
      {props.state == 'initial' && (
        <Icon className="pf-v5-c-progress-stepper pf-v5-c-progress-stepper__step-icon" isInline>
          <PendingIcon />
        </Icon>
      )}
      {props.state == 'waiting' && (
        <Icon className="pf-v5-c-progress-stepper pf-v5-c-progress-stepper__step-icon" isInline>
          <PendingIcon />
        </Icon>
      )}
      {props.state == 'timed-out' && (
        <Icon className="pf-v5-c-progress-stepper pf-v5-c-progress-stepper__step-icon pf-v5-u-icon-color-dark" isInline>
          <PendingIcon />
        </Icon>
      )}
      {props.state == 'not-found' && (
        <Icon className="pf-v5-c-progress-stepper pf-v5-c-progress-stepper__step-icon pf-v5-u-icon-color-dark" status="danger" isInline>
          <ExclamationCircleIcon />
        </Icon>
      )}
      {props.state == 'completed' && (
        <Icon className="pf-v5-c-progress-stepper pf-v5-c-progress-stepper__step-icon pf-v5-u-icon-color-dark" status="success" isInline>
          <CheckCircleIcon />
        </Icon>
      )}
    </>
  );
};

/* VerifyRegistryLabel component */

interface VerifyRegistryLabelProps {
  state: VerifyState;
}

const VerifyRegistryLabel = (props: VerifyRegistryLabelProps) => {
  return (
    <>
      {props.state == 'initial' && <TextContent className="pf-v5-u-font-weight-bold">Verify registration</TextContent>}
      {props.state == 'waiting' && <TextContent className="pf-v5-u-font-weight-bold">Verify registration</TextContent>}
      {props.state == 'timed-out' && <TextContent className="pf-v5-u-font-weight-bold pf-v5-u-danger-color-100">Verify registration</TextContent>}
      {props.state == 'not-found' && <TextContent className="pf-v5-u-font-weight-bold pf-v5-u-danger-color-100">Verify registration</TextContent>}
      {props.state == 'completed' && <TextContent>Verify registration</TextContent>}
    </>
  );
};

/* VerifyRegistryLabel component */

interface VerifyRegistryDescriptionProps {
  state: VerifyState;
}

const VerifyRegistryDescription = (props: VerifyRegistryDescriptionProps) => {
  return (
    <>
      {props.state == 'initial' && <TextContent className="pf-v5-u-color-200">Running verification test</TextContent>}
      {props.state == 'waiting' && <TextContent className="pf-v5-u-color-200">Waiting for registration data</TextContent>}
      {props.state == 'timed-out' && <TextContent className="pf-v5-u-color-200">Test timed out</TextContent>}
      {props.state == 'not-found' && <TextContent className="pf-v5-u-color-200">Registration data not found</TextContent>}
      {props.state == 'completed' && <TextContent className="pf-v5-u-color-200">Test completed</TextContent>}
    </>
  );
};

/* VerifyRegistryyFooter */

interface VerifyRegistryFooterProps {
  state: VerifyState;
  onTest?: () => void;
}

const VerifyRegistryFooter = (props: VerifyRegistryFooterProps) => {
  return (
    <>
      {props.state == 'initial' && (
        <>
          <Button className="pf-v5-u-my-xs" variant="secondary" onClick={props.onTest} ouiaId="ButtonVerifyTest">
            Test
          </Button>
        </>
      )}
      {props.state == 'waiting' && <></>}
      {props.state == 'timed-out' && (
        <>
          <Button variant="secondary" onClick={props.onTest} ouiaId="ButtonVerifyTestAgain">
            Test again
          </Button>
        </>
      )}
      {props.state == 'not-found' && <></>}
      {props.state == 'completed' && (
        <>
          <Button variant="secondary" onClick={props.onTest} ouiaId="ButtonVerifyCompleted">
            Test
          </Button>
        </>
      )}
    </>
  );
};

/* VerifyRegistry component */

interface VerifyRegistryProps {
  state: VerifyState;
  uuid: string;
  onChange: (newState: VerifyState, domain?: Domain) => void;
}

const VerifyRegistry = (props: VerifyRegistryProps) => {
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);

  const second = 1000;
  const checkInterval = 2 * second;
  const timeout = 15 * 60 * second; // 15 minutes

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let newState: VerifyState = props.state;
    let domain: Domain | undefined = undefined;
    const stopPolling = (state: VerifyState, domain?: Domain) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = null;
      setIsPolling(false);
      if (state === 'completed') {
        props.onChange(state, domain);
      } else {
        props.onChange(state);
      }
    };
    if (!isPolling) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await resources_api.readDomain(props.uuid, undefined, undefined);
        newState = 'completed';
        domain = response.data;
        newState = 'completed';
      } catch (error) {
        const axiosError = error as AxiosError;
        switch (axiosError.code) {
          case AxiosError.ECONNABORTED:
          case AxiosError.ERR_BAD_OPTION:
          case AxiosError.ERR_BAD_OPTION_VALUE:
          case AxiosError.ERR_CANCELED:
            newState = 'waiting';
            break;
          case AxiosError.ERR_DEPRECATED:
          case AxiosError.ERR_FR_TOO_MANY_REDIRECTS:
          case AxiosError.ERR_NETWORK:
          case AxiosError.ETIMEDOUT:
            newState = 'timed-out';
            break;
          case AxiosError.ERR_BAD_REQUEST:
          case AxiosError.ERR_BAD_RESPONSE:
          default:
            newState = 'waiting';
            break;
        }
      }

      const elapsedTime = Date.now() - startTime;

      if (newState !== undefined && newState !== props.state) {
        switch (newState) {
          case 'timed-out':
          case 'waiting':
            props.onChange(newState);
            break;
          default:
            if (elapsedTime >= timeout) {
              newState = 'timed-out';
              stopPolling(newState);
            }
            break;
          case 'completed':
            stopPolling(newState, domain);
            break;
        }
      }
      if (elapsedTime > timeout) {
        newState = 'timed-out';
        stopPolling(newState);
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, checkInterval);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPolling]);

  const onRetry = () => {
    setStartTime(Date.now());
    props.onChange('initial');
    setIsPolling(true);
  };

  return (
    <span className="pf-v5-u-text-align-center">
      <Stack className="pf-v5-u-py-md">
        <StackItem className="pf-v5-u-py-xs pf-v5-u-m-auto">
          <VerifyRegistryIcon state={props.state} />
        </StackItem>
        <StackItem className="pf-v5-u-py-xs">
          <VerifyRegistryLabel state={props.state} />
        </StackItem>
        <StackItem className="pf-v5-u-py-xs">
          <VerifyRegistryDescription state={props.state} />
        </StackItem>
        <StackItem className="pf-v5-u-text-align-center pf-v5-u-py-xs">
          <VerifyRegistryFooter state={props.state} onTest={onRetry} />
        </StackItem>
      </Stack>
    </span>
  );
};

// VerifyRegistry.defaultProps = defaultVerifyRegistryProps;

export default VerifyRegistry;
