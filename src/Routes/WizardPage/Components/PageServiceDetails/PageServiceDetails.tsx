import React, { useState } from 'react';
import { Form, FormGroup, Icon, TextArea, Title, Tooltip } from '@patternfly/react-core';
import { TextInput } from '@patternfly/react-core';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';

import './PageServiceDetails.scss';
import { Switch } from '@patternfly/react-core';

/**
 * Represent the properties accepted by the PageServiceDetails
 * component.
 * @see {@link PageServiceDetails}
 */
interface PageServiceDetailsProps {
  /** The title that represent the domain. */
  title?: string;
  /** The long description for the domain. */
  description?: string;
  /** Flag to enable / disable the auto enrollment feature. */
  autoEnrollmentEnabled?: boolean;

  /** Event fired when the title change. */
  onChangeTitle?: (value: string) => void;
  /** Event fired when the description change. */
  onChangeDescription?: (value: string) => void;
  /** Event fired when the switch for auto-enrollment change. */
  onChangeAutoEnrollment?: (value: boolean) => void;
}

/**
 * It provides fields to the user to customize the values such as
 * the title, description and if the domain will be avialable for
 * auto-enrollment.
 * @param props the properties received from the parent component.
 * @returns return the view for the Service Details wizard page.
 * @public
 * @see {@link PageServiceDetailsProps} about the properties.
 * @see {@link WizardPage} to know about the parent component.
 */
const PageServiceDetails = (props: PageServiceDetailsProps) => {
  const [title, setTitle] = useState<string>(props.title ? props.title : '');
  const [description, setDescription] = useState<string>(props.description ? props.description : '');
  const [isAutoEnrollmentEnabled, setIsAutoEnrollmentEnabled] = React.useState<boolean>(
    props.autoEnrollmentEnabled ? props.autoEnrollmentEnabled : false
  );

  const onChangeAutoEnrollment = (checked: boolean) => {
    setIsAutoEnrollmentEnabled(checked);
    if (props.onChangeAutoEnrollment) {
      props.onChangeAutoEnrollment(checked);
    }
  };

  const onChangeTitle = (value: string, event: React.FormEvent<HTMLInputElement>) => {
    setTitle(value);
    if (props.onChangeTitle) {
      props.onChangeTitle(value);
    }
  };

  const onChangeDescription = (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(value);
    if (props.onChangeDescription) {
      props.onChangeDescription(value);
    }
  };

  const autoEnrollmentTooltipContent = isAutoEnrollmentEnabled
    ? 'Enabling makes the serice available for the "Domain join on launch" feature within Image Builder.'
    : 'Disabling the option leaves the service registration intact, but does not make it available for the "Domain join on launch" feature within Image Builder. It can be enabled later in the "Register Directory and Domain Service" view.';

  return (
    <>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Title headingLevel={'h2'}>Service Details</Title>
        <FormGroup label="Service name" isRequired fieldId="register-domain-name">
          <TextInput id="register-domain-name" className="pf-u-w-100 pf-u-w-50-on-md pf-u-w-50-on-xl" value={title} onChange={onChangeTitle} />
        </FormGroup>
        <FormGroup label="Service description" fieldId="register-domain-description">
          <TextArea
            contentEditable="true"
            id="register-domain-description"
            type="text"
            readOnly={false}
            className="pf-u-w-100 pf-u-w-50-on-md pf-u-w-50-on-xl"
            value={description}
            onChange={onChangeDescription}
          />
        </FormGroup>
        <FormGroup
          label={
            <>
              Domain join on launch{' '}
              <Icon className="pf-u-ml-xs">
                <Tooltip content={autoEnrollmentTooltipContent}>
                  <OutlinedQuestionCircleIcon />
                </Tooltip>
              </Icon>
            </>
          }
        >
          <Switch
            label="Enable upon finishing registration"
            labelOff="Disable upon finishing registration"
            id="checked-with-label-switch-on"
            aria-label="Message when on"
            isChecked={isAutoEnrollmentEnabled}
            hasCheckIcon
            onChange={onChangeAutoEnrollment}
          />
        </FormGroup>
      </Form>
    </>
  );
};

export default PageServiceDetails;
