import { Button, Checkbox, Modal } from '@patternfly/react-core';
import './ConfirmDeleteDomain.scss';
import React from 'react';
import { Domain } from '../../Api/idmsvc';

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
  const [isConfirmed, setIsConfirmed] = React.useState(false);

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
        <Button key="delete" variant="danger" onClick={onDeleteWrapper} isDisabled={!isConfirmed} ouiaId="ButtonModalConfirmDeletionDelete">
          Delete
        </Button>,
        <Button key="cancel" variant="link" onClick={props.onCancel} ouiaId="ButtonModalConfirmDeletionCancel">
          Cancel
        </Button>,
      ]}
    >
      Hosts will be unable to automatically join the domain
      <b> {props.domain?.title || ''}</b> after deletion.
      <Checkbox
        label="I understand that this action cannot be undone"
        isChecked={isConfirmed}
        onChange={(_event, value) => setIsConfirmed(value)}
        id="confirm-delete-domain-checkbox"
        name="confirm-delete-domain-checkbox"
        className="pf-v5-u-mt-lg"
      />
    </Modal>
  );
};

export default ConfirmDeleteDomain;
