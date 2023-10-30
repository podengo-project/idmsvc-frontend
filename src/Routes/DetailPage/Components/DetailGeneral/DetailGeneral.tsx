import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Icon,
  Switch,
  Tooltip,
} from '@patternfly/react-core';
import React from 'react';
import { Domain } from '../../../../Api';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import DownloadIcon from '@patternfly/react-icons/dist/esm/icons/download-icon';

interface DetailGeneralProps {
  domain?: Domain;
  onShowServerTab?: () => void;
}

export const DetailGeneral = (props: DetailGeneralProps) => {
  // const context = useContext(AppContext);
  const domain = props.domain;
  if (domain === undefined) {
    return <></>;
  }

  const handleAutoJoin = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    new Error('handleAutoJoin not implemented');
    return;
  };

  return (
    <>
      <DescriptionList
        isHorizontal
        horizontalTermWidthModifier={{
          default: '12ch',
          sm: '15ch',
          md: '20ch',
          lg: '24ch',
          xl: '28ch',
          '2xl': '20ch',
        }}
      >
        <DescriptionListGroup>
          <DescriptionListTerm>
            Identity domain type
            <Icon className="pf-u-ml-xs">
              <Tooltip content={'Identity domain type'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>Red Hat IdM</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            Kerberos realm
            <Icon className="pf-u-ml-xs">
              <Tooltip content={'Kerberos realm'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>{domain?.['rhel-idm']?.realm_name}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            Display name
            <Icon className="pf-u-ml-xs">
              <Tooltip content={'Display name'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>
            {domain?.title}{' '}
            <Button
              variant="plain"
              onClick={() => {
                console.warn('not implemented');
                new Error('not implemented');
                return;
              }}
            >
              <Icon>
                <PencilAltIcon />
              </Icon>
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            Description
            <Icon className="pf-u-ml-xs">
              <Tooltip content={'Description'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>
            {domain?.description}{' '}
            <Button
              className="pf-global--primary-color--100"
              variant="link"
              onClick={() => {
                console.warn('not implemented');
                new Error('not implemented');
                return;
              }}
            >
              <Icon>
                <PencilAltIcon />
              </Icon>
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            Red Hat IdM servers
            <Icon className="pf-u-ml-xs">
              <Tooltip content={'Red Hat IdM servers'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <Button
              isInline
              className="pf-global--primary-color--100"
              variant="link"
              onClick={() => {
                props.onShowServerTab && props.onShowServerTab();
              }}
            >
              {domain?.['rhel-idm']?.servers.length}
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            UUID
            <Icon className="pf-u-ml-xs">
              <Tooltip content={'UUID'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>{domain?.domain_id}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            Domain auto-join on launch
            <Icon className="pf-u-ml-xs">
              <Tooltip content={'Domain auto-join on launch'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <Switch hasCheckIcon={true} label="Enabled" labelOff="Disabled" isChecked={domain.auto_enrollment_enabled} onChange={handleAutoJoin} />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            Certificate Authority
            <Icon className="pf-u-ml-xs">
              <Tooltip content={'Certificate Authority'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <Button
              isInline
              variant="link"
              onClick={() => {
                console.warn('not implemented');
                new Error('not implemented');
                return;
              }}
            >
              <Icon>
                <DownloadIcon />
              </Icon>{' '}
              Download certificate
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </>
  );
};
