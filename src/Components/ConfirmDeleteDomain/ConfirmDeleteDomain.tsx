import { Button, Modal } from '@patternfly/react-core';
import './ConfirmDeleteDomain.scss';
import React from 'react';
import { Domain } from '../../Api/api';

interface ConfirmDeleteDomainProps {
  domain?: Domain;
  isOpen?: boolean;
  onDelete?: (domain?: Domain) => void;
  onCancel?: () => void;
}

/**
 * Modal dialog to confirm a domain deletion.
 *
 * @param props the props given by the smart component.
 */
const ConfirmDeleteDomain: React.FC<ConfirmDeleteDomainProps> = (props) => {
  const onDeleteWrapper = () => {
    props.onDelete && props.onDelete(props.domain);
  };
  return (
    <Modal
      isOpen={props.isOpen}
      titleIconVariant={'warning'}
      variant="small"
      title="Delete identity domain registration?"
      ouiaId="ModalConfirmDeletion"
      onClose={props.onCancel}
      actions={[
        <Button key="delete" variant="danger" onClick={onDeleteWrapper} ouiaId="ButtonModalConfirmDeletionDelete">
          Delete
        </Button>,
        <Button key="cancel" variant="link" onClick={props.onCancel} ouiaId="ButtonModalConfirmDeletionCancel">
          Cancel
        </Button>,
      ]}
    >
      No new host enrollment from HCC will be allowed on <b>{props.domain?.title || ''}</b> domain after registration deletion.
    </Modal>
  );
};

export default ConfirmDeleteDomain;
