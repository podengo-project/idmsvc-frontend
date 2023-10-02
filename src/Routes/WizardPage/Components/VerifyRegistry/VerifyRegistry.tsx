import React, { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { Button, Icon, Stack, StackItem, TextContent } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { PendingIcon } from '@patternfly/react-icons/dist/esm/icons/pending-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';

import './VerifyRegistry.scss';
import { Domain, ResourcesApiFactory } from '../../../../Api';

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
        <Icon className="pf-c-progress-stepper pf-c-progress-stepper__step-icon" isInline>
          <PendingIcon />
        </Icon>
      )}
      {props.state == 'waiting' && (
        <Icon className="pf-c-progress-stepper pf-c-progress-stepper__step-icon" isInline>
          <PendingIcon />
        </Icon>
      )}
      {props.state == 'timed-out' && (
        <Icon className="pf-c-progress-stepper pf-c-progress-stepper__step-icon pf-u-icon-color-dark" isInline>
          <PendingIcon />
        </Icon>
      )}
      {props.state == 'not-found' && (
        <Icon className="pf-c-progress-stepper pf-c-progress-stepper__step-icon pf-u-icon-color-dark" status="danger" isInline>
          <ExclamationCircleIcon />
        </Icon>
      )}
      {props.state == 'completed' && (
        <Icon className="pf-c-progress-stepper pf-c-progress-stepper__step-icon pf-u-icon-color-dark" status="success" isInline>
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
      {props.state == 'initial' && <TextContent className="pf-u-font-weight-bold">Verify registration</TextContent>}
      {props.state == 'waiting' && <TextContent className="pf-u-font-weight-bold">Verify registration</TextContent>}
      {props.state == 'timed-out' && <TextContent className="pf-u-font-weight-bold pf-u-danger-color-100">Verify registration</TextContent>}
      {props.state == 'not-found' && <TextContent className="pf-u-font-weight-bold pf-u-danger-color-100">Verify registration</TextContent>}
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
      {props.state == 'initial' && <TextContent className="pf-u-color-200">Running verification test</TextContent>}
      {props.state == 'waiting' && <TextContent className="pf-u-color-200">Waiting for registration data</TextContent>}
      {props.state == 'timed-out' && <TextContent className="pf-u-color-200">Test timed out</TextContent>}
      {props.state == 'not-found' && <TextContent className="pf-u-color-200">Registration data not found</TextContent>}
      {props.state == 'completed' && <TextContent className="pf-u-color-200">Test completed</TextContent>}
    </>
  );
};

/* VerifyRegistryyFooter */

interface VerifyRegistryFooterProps {
  state: VerifyState;
  onTest?: () => void;
}

const VerifyRegistryFooter = (props: VerifyRegistryFooterProps) => {
  const linkTroubleshootRegistration = 'https://www.google.com/search?q=freeipa+troubleshooting';
  return (
    <>
      {props.state == 'initial' && (
        <>
          <Button className="pf-u-my-xs" variant="secondary" onClick={props.onTest}>
            Test
          </Button>
        </>
      )}
      {props.state == 'waiting' && <></>}
      {props.state == 'timed-out' && (
        <>
          <Button variant="secondary" onClick={props.onTest}>
            Test again
          </Button>
        </>
      )}
      {props.state == 'not-found' && (
        <>
          <Button isInline variant="link" target="_blank" href={linkTroubleshootRegistration} icon={<ExternalLinkAltIcon />} iconPosition="right">
            Troubleshoot registration
          </Button>
        </>
      )}
      {props.state == 'completed' && (
        <>
          <Button variant="secondary" onClick={props.onTest}>
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

  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);
  const timeout = 3 * 1000; // Seconds

  /** TODO Extract this effect in a hook to simplify this code */
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let elapsedTime = 0;
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

      if (newState !== undefined && newState !== props.state) {
        switch (newState) {
          case 'timed-out':
          case 'waiting':
            props.onChange(newState);
            // setState(newState);
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
      elapsedTime += 1000; // Increase elapsed time by 1 second
      if (elapsedTime > timeout) {
        newState = 'timed-out';
        stopPolling(newState);
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPolling]);

  const onRetry = () => {
    props.onChange('initial');
    // setState('initial');
    setIsPolling(true);
  };

  return (
    <span className="pf-u-text-align-center">
      <Stack className="pf-u-py-md">
        <StackItem className="pf-u-py-xs pf-u-m-auto">
          <VerifyRegistryIcon state={props.state} />
        </StackItem>
        <StackItem className="pf-u-py-xs">
          <VerifyRegistryLabel state={props.state} />
        </StackItem>
        <StackItem className="pf-u-py-xs">
          <VerifyRegistryDescription state={props.state} />
        </StackItem>
        <StackItem className="pf-u-text-align-center pf-u-py-xs">
          <VerifyRegistryFooter state={props.state} onTest={onRetry} />
        </StackItem>
      </Stack>
    </span>
  );
};

// VerifyRegistry.defaultProps = defaultVerifyRegistryProps;

export default VerifyRegistry;
