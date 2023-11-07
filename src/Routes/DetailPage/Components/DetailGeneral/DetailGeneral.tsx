import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Icon,
  Modal,
  ModalVariant,
  Switch,
  TextArea,
  TextInput,
  Tooltip,
} from '@patternfly/react-core';
import React from 'react';
import { useState } from 'react';
import { Domain, ResourcesApiFactory } from '../../../../Api';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import DownloadIcon from '@patternfly/react-icons/dist/esm/icons/download-icon';

interface DetailGeneralProps {
  domain?: Domain;
  onShowServerTab?: () => void;
}

export const DetailGeneral = (props: DetailGeneralProps) => {
  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);

  // const context = useContext(AppContext);
  const domain = props.domain;
  if (domain === undefined) {
    return <></>;
  }

  // States
  const [autoJoin, setAutoJoin] = useState<boolean | undefined>(domain.auto_enrollment_enabled);
  const [title, setTitle] = useState<string>(domain.title || '');
  const [description, setDescription] = useState<string>(domain.description || '');

  const [editTitle, setEditTitle] = useState<string>(domain.title || '');
  const [editDescription, setEditDescription] = useState<string>(domain.description || '');

  const [isTitleModalOpen, setIsTitleModalOpen] = useState<boolean>(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState<boolean>(false);

  // Control handlers
  const handleSaveTitleButton = () => {
    console.log('Save Title button pressed');
    if (domain.domain_id) {
      resources_api
        .updateDomainUser(domain.domain_id, {
          title: editTitle,
        })
        .then((response) => {
          if (response.status == 200) {
            setTitle(response.data.title || '');
          } else {
            // TODO show-up notification with error message
          }
        })
        .catch((error) => {
          // TODO show-up notification with error message
          console.log('error at handleSaveTitleButton: ' + error);
        });
    }
    setIsTitleModalOpen(false);
  };

  const handleCancelTitleButton = () => {
    console.log('Cancel Title button pressed');
    setIsTitleModalOpen(false);
  };

  const handleSaveDescriptionButton = () => {
    console.log('Save Description button pressed');
    if (domain.domain_id) {
      resources_api
        .updateDomainUser(domain.domain_id, {
          description: editDescription,
        })
        .then((response) => {
          if (response.status == 200) {
            setDescription(response.data.description || '');
          } else {
            // TODO show-up notification with error message
          }
        })
        .catch((error) => {
          // TODO show-up notification with error message
          console.log('error at handleSaveDescriptionButton: ' + error);
        });
    }
    setIsDescriptionModalOpen(false);
  };

  const handleCancelDescriptionButton = () => {
    console.log('Cancel Description button pressed');
    setIsDescriptionModalOpen(false);
  };

  const handleAutoJoin = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    console.log('toggled auto-join enable/disable');
    if (domain.domain_id) {
      resources_api
        .updateDomainUser(domain.domain_id, {
          auto_enrollment_enabled: !autoJoin,
        })
        .then((response) => {
          if (response.status == 200) {
            setAutoJoin(response.data.auto_enrollment_enabled);
          } else {
            // TODO show-up notification with error message
          }
        })
        .catch((error) => {
          // TODO show-up notification with error message
          console.log('error onClose: ' + error);
        });
    }
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
            {title}{' '}
            <Button
              variant="plain"
              onClick={() => {
                setEditTitle(title);
                setIsTitleModalOpen(true);
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
            {description}{' '}
            <Button
              className="pf-global--primary-color--100"
              variant="link"
              onClick={() => {
                setEditDescription(description);
                setIsDescriptionModalOpen(true);
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
            <Switch hasCheckIcon={true} label="Enabled" labelOff="Disabled" isChecked={autoJoin} onChange={handleAutoJoin} />
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
      <Modal
        variant={ModalVariant.small}
        title="Edit display name"
        isOpen={isTitleModalOpen}
        onClose={handleCancelTitleButton}
        actions={[
          <Button key="save" variant="primary" isDisabled={title == editTitle} onClick={handleSaveTitleButton}>
            Save
          </Button>,
          <Button key="cancel" variant="link" onClick={handleCancelTitleButton}>
            Cancel
          </Button>,
        ]}
      >
        <TextInput value={editTitle} type="text" onChange={(value) => setEditTitle(value)} />
      </Modal>
      <Modal
        variant={ModalVariant.small}
        title="Edit description"
        isOpen={isDescriptionModalOpen}
        onClose={handleCancelDescriptionButton}
        actions={[
          <Button key="save" variant="primary" isDisabled={description == editDescription} onClick={handleSaveDescriptionButton}>
            Save
          </Button>,
          <Button key="cancel" variant="link" onClick={handleCancelDescriptionButton}>
            Cancel
          </Button>,
        ]}
      >
        <TextArea value={editDescription} onChange={(value) => setEditDescription(value)} />
      </Modal>
    </>
  );
};
