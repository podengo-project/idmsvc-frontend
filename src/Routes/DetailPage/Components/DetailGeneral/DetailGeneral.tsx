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
  Text,
  TextArea,
  TextInput,
  Tooltip,
} from '@patternfly/react-core';
import React from 'react';
import { useState } from 'react';
import { Domain, ResourcesApiFactory } from '../../../../Api/idmsvc';
import useNotification from '../../../../Hooks/useNotification';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import PencilAltIcon from '@patternfly/react-icons/dist/js/icons/pencil-alt-icon';
import {
  buildAutoJoinToggleFailedNotification,
  buildDescriptionEditFailedNotification,
  buildDescriptionEditSuccessNotification,
  buildTitleEditFailedNotification,
  buildTitleEditSuccessNotification,
} from '../../detailNotifications';
import useIdmPermissions from '../../../../Hooks/useIdmPermissions';

interface DetailGeneralProps {
  domain?: Domain;
  onShowServerTab?: () => void;
  onChange?: (domain: Domain) => void;
}

export const DetailGeneral = (props: DetailGeneralProps) => {
  const domain = props.domain;
  if (domain === undefined) {
    return <></>;
  }

  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);
  const rbac = useIdmPermissions();
  const { notifyError, notifySuccess } = useNotification();

  // States
  const [autoJoin, setAutoJoin] = useState<boolean | undefined>(domain.auto_enrollment_enabled);
  const [title, setTitle] = useState<string>(domain.title || '');
  const [description, setDescription] = useState<string>(domain.description || '');

  const [editTitle, setEditTitle] = useState<string>(domain.title || '');
  const [editDescription, setEditDescription] = useState<string>(domain.description || '');

  const [isTitleModalOpen, setIsTitleModalOpen] = useState<boolean>(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState<boolean>(false);

  const canSaveTitle = !!editTitle && editTitle !== title;

  // Control handlers
  const saveTitle = () => {
    console.log('Save Title requested');
    if (!canSaveTitle) {
      console.log('Title change is not valid');
      return;
    }
    if (domain.domain_id) {
      resources_api
        .updateDomainUser(domain.domain_id, {
          title: editTitle,
        })
        .then((response) => {
          if (response.status == 200) {
            setTitle(response.data.title || '');
            if (props.onChange !== undefined) props.onChange({ ...domain, title: response.data.title });
            notifySuccess(buildTitleEditSuccessNotification());
          } else {
            notifyError(buildTitleEditFailedNotification());
          }
        })
        .catch((error) => {
          notifyError(buildTitleEditFailedNotification());
          console.log('error at saveTitle: ' + error);
        });
    }
    setIsTitleModalOpen(false);
  };

  const confirmTitleByEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      saveTitle();
    }
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
            if (props.onChange !== undefined) props.onChange({ ...domain, description: response.data.description });
            notifySuccess(buildDescriptionEditSuccessNotification());
          } else {
            notifyError(buildDescriptionEditFailedNotification());
          }
        })
        .catch((error) => {
          notifyError(buildDescriptionEditFailedNotification());
          console.log('error at handleSaveDescriptionButton: ' + error);
        });
    }
    setIsDescriptionModalOpen(false);
  };

  const handleCancelDescriptionButton = () => {
    console.log('Cancel Description button pressed');
    setIsDescriptionModalOpen(false);
  };

  const handleAutoJoin = () => {
    console.log('toggled auto-join enable/disable');
    if (domain.domain_id) {
      resources_api
        .updateDomainUser(domain.domain_id, {
          auto_enrollment_enabled: !autoJoin,
        })
        .then((response) => {
          if (response.status == 200) {
            setAutoJoin(response.data.auto_enrollment_enabled);
            if (props.onChange !== undefined) props.onChange({ ...domain, auto_enrollment_enabled: response.data.auto_enrollment_enabled });
          } else {
            notifyError(buildAutoJoinToggleFailedNotification(domain));
          }
        })
        .catch((error) => {
          notifyError(buildAutoJoinToggleFailedNotification(domain));
          console.log('error handleAutoJoin: ' + error);
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
            <Icon className="pf-v5-u-ml-xs">
              <Tooltip content={'Only Red Hat Identity Management (IdM) is currently supported.'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>Red Hat IdM</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Kerberos realm</DescriptionListTerm>
          <DescriptionListDescription>{domain?.['rhel-idm']?.realm_name}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Display name</DescriptionListTerm>
          <DescriptionListDescription>
            {title}{' '}
            <Button
              variant="link"
              onClick={() => {
                setEditTitle(title);
                setIsTitleModalOpen(true);
                return;
              }}
              ouiaId="ButtonDetailGeneralEditTitle"
              isDisabled={!rbac.permissions.hasDomainsUpdate}
            >
              <Icon>
                <PencilAltIcon />
              </Icon>
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm className="pf-v5-u-align-text-top">
            <Text>Description</Text>
          </DescriptionListTerm>
          <DescriptionListDescription className="pf-v5-u-text-wrap">
            <span style={{ whiteSpace: 'pre-line' }}>{description} </span>
            <Button
              variant="link"
              onClick={() => {
                setEditDescription(description);
                setIsDescriptionModalOpen(true);
              }}
              ouiaId="ButtonDetailGeneralEditDescription"
              isDisabled={!rbac.permissions.hasDomainsUpdate}
            >
              <Icon>
                <PencilAltIcon />
              </Icon>
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Red Hat IdM servers</DescriptionListTerm>
          <DescriptionListDescription>
            <Button
              isInline
              variant="link"
              onClick={() => {
                props.onShowServerTab && props.onShowServerTab();
              }}
              ouiaId="ButtonDetailGeneralEditAutoenrollment"
            >
              {domain?.['rhel-idm']?.servers.length}
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            UUID
            <Icon className="pf-v5-u-ml-xs">
              <Tooltip content={'Unique ID of this domain registration'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>{domain?.domain_id}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            Domain auto-join on launch
            <Icon className="pf-v5-u-ml-xs">
              <Tooltip content={'This option allows hosts to join this identity domain using domain auto-join on launch'}>
                <OutlinedQuestionCircleIcon />
              </Tooltip>
            </Icon>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <Switch
              hasCheckIcon={true}
              label="Enabled"
              labelOff="Disabled"
              isChecked={autoJoin}
              onChange={handleAutoJoin}
              ouiaId="ButtonDetailGeneralAutoenroll"
              isDisabled={!rbac.permissions.hasDomainsUpdate}
            />
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <Modal
        variant={ModalVariant.small}
        title="Edit display name"
        isOpen={isTitleModalOpen}
        onClose={handleCancelTitleButton}
        ouiaId="ModalTitle"
        onKeyUp={confirmTitleByEnter}
        actions={[
          <Button key="save" variant="primary" isDisabled={!canSaveTitle} onClick={saveTitle} ouiaId="ButtonModalDomainDomainTitleSave">
            Save
          </Button>,
          <Button key="cancel" variant="link" onClick={handleCancelTitleButton} ouiaId="ButtonModalDomainDomainTitleCancel">
            Cancel
          </Button>,
        ]}
      >
        <TextInput
          value={editTitle}
          type="text"
          onChange={(_event, value) => setEditTitle(value)}
          ouiaId="TextModalDomainTitle"
          aria-label="New Title"
        />
      </Modal>
      <Modal
        variant={ModalVariant.small}
        title="Edit description"
        isOpen={isDescriptionModalOpen}
        onClose={handleCancelDescriptionButton}
        ouiaId="ModalDesription"
        actions={[
          <Button
            key="save"
            variant="primary"
            isDisabled={description == editDescription}
            onClick={handleSaveDescriptionButton}
            ouiaId="ButtonModalDescriptionSave"
          >
            Save
          </Button>,
          <Button key="cancel" variant="link" onClick={handleCancelDescriptionButton} ouiaId="ButtonModalDescriptionCancel">
            Cancel
          </Button>,
        ]}
      >
        <TextArea
          autoResize
          resizeOrientation="vertical"
          value={editDescription}
          onChange={(_event, value) => setEditDescription(value)}
          aria-label="New Description"
        />
      </Modal>
    </>
  );
};
