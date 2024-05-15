import React from 'react';
import { Button, Modal } from '@patternfly/react-core';
import './AutoJoinChangeConfirmDialog.scss';

import { Domain } from '../../Api/idmsvc';

interface AutoJoinChangeConfirmDialogProps {
  /** The domain to be changed */
  domain?: Domain;
  /** Flag to open the dialog */
  isOpen: boolean;
  /** Event fired when the user confirms the change */
  onConfirm?: (domain?: Domain) => void;
  /** Event fired when the user cancels the change */
  onCancel?: () => void;
}

/**
 * Modal dialog to confirm a change in domain auto-join.
 *
 * @param props
 */
const AutoJoinChangeConfirmDialog: React.FC<AutoJoinChangeConfirmDialogProps> = (props) => {
  if (!props.domain) {
    return <></>;
  }

  const domain = props.domain;

  const onConfirmWrapper = () => {
    props.onConfirm !== undefined && props.onConfirm(domain);
  };

  let title = '';
  let text: React.ReactNode = '';
  if (domain.auto_enrollment_enabled) {
    title = `Disable domain auto-join on launch`;
    text = (
      <div>
        <p>Are you sure you want to disable domain auto-join?</p>
        <p>
          Disabling will prevent systems from automatically joining the domain <strong>{domain.title}</strong>.
        </p>
      </div>
    );
  } else {
    title = `Enable domain auto-join on launch`;
    text = (
      <div>
        <p>Are you sure you want to enable domain auto-join?</p>
        <p>
          Enabling will allow systems to automatically join the domain <strong>{domain.title}</strong>.
        </p>
      </div>
    );
  }

  return (
    <Modal
      isOpen={props.isOpen}
      titleIconVariant={'warning'}
      variant="small"
      title={title}
      ouiaId="DomainAutoJoinChangeConfirmDialog"
      onClose={props.onCancel}
      actions={[
        <Button key="change" variant="primary" onClick={onConfirmWrapper} ouiaId="ButtonDomainAutoJoinChangeConfirmDialogOK">
          OK
        </Button>,
        <Button key="cancel" variant="link" onClick={props.onCancel} ouiaId="ButtonDomainAutoJoinChangeConfirmDialogCancel">
          Cancel
        </Button>,
      ]}
    >
      {text}
    </Modal>
  );
};

export default AutoJoinChangeConfirmDialog;
