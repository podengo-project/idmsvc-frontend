import React from 'react';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import CopyIcon from '@patternfly/react-icons/dist/esm/icons/copy-icon';

import {
  Button,
  Form,
  FormGroup,
  Icon,
  Select,
  SelectOption,
  Stack,
  TextContent,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core';

import './Page1.scss';
// import { useNavigate } from 'react-router-dom';

const Page1 = () => {
  // TODO Update links
  const firewallConfigurationLink =
    'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_and_managing_networking/using-and-configuring-firewalld_configuring-and-managing-networking';
  const cloudProviderConfigurationLink =
    'https://access.redhat.com/documentation/es-es/red_hat_subscription_management/2023/html-single/red_hat_cloud_access_reference_guide/index';
  const networkConfigurationLink = 'https://www.redhat.com/sysadmin/network-interface-linux';
  const installServerPackagesLink = 'https://freeipa.org/page/Quick_Start_Guide';

  const [isOpen, setIsOpen] = React.useState(false);

  // hooks
  const onRegisterDomainTypeSelect = () => {
    // TODO Not implemented
    console.debug('onRegisterDomainTypeSelect in WizardPage');
    return;
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  // const openInNewWindow = (url: string) => {
  //   window.open(url, '_blank');
  // };

  // const onInstallServerPackagesClick = () => {
  //   openInNewWindow(installServerPackagesLink);
  // };

  const domainOptions = [
    {
      value: 'rhel-idm',
      title: 'Red Hat Enterprise Linux IdM/IPA',
    },
  ];

  const onCopyPkgCommand = () => {
    // FIXME Add logic to copy content to the clipboard
    console.warn('WizardPage:Page1:onCopyPkgCommand:Not implemented');
    return;
  };

  return (
    <React.Fragment>
      <Form
        onSubmit={(value) => {
          console.debug('onSubmit WizardPage' + String(value));
        }}
      >
        <FormGroup
          label="Identity and access management service"
          isRequired
          fieldId="register-domain-type"
          helperText={
            <TextContent style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Icon status="info" isInline>
                <InfoCircleIcon />
              </Icon>
              <span> </span>
              Only Red Hat Linux IdM/IPA are currently supported.
            </TextContent>
          }
        >
          <Select
            id="register-domain-type"
            isDisabled
            isOpen={isOpen}
            onSelect={onRegisterDomainTypeSelect}
            // onOpenChange={(isOpen) => setIsOpen(isOpen)}
            onToggle={onToggleClick}
            className="domain-type-select"
          >
            {domainOptions.map((option) => (
              <SelectOption key={option.value} value={option.value}>
                {option.title}
              </SelectOption>
            ))}
          </Select>
        </FormGroup>
        <FormGroup label="Prerequisites">
          <TextContent>
            There are prerequisites that must be completed to create and use security for Red Hat Linux IdM/IPA. If any prerequisites are already in
            place, please skip to the next step:
          </TextContent>
          <Button
            className="domain-item-margin-left"
            component="a"
            target="_blank"
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="right"
            isInline
            href={firewallConfigurationLink}
          >
            1. Firewall configuration
          </Button>
          <br />
          <Button
            className="domain-item-margin-left"
            component="a"
            target="_blank"
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="right"
            isInline
            href={cloudProviderConfigurationLink}
          >
            2. Cloud provider configuration
          </Button>
          <br />
          <Button
            className="domain-item-margin-left"
            component="a"
            target="_blank"
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="right"
            isInline
            href={networkConfigurationLink}
          >
            3. Networking configuration
          </Button>
          <br />
          <Stack className="domain-item-margin-left">
            <TextContent>4. Verify wether or not the package is present on your server(st) with this command:</TextContent>
            <br />
            <TextInputGroup>
              <TextInputGroupMain value="disabled test input example" />
              <TextInputGroupUtilities>
                <Button variant="plain" onClick={onCopyPkgCommand} aria-label="Copy to clipboard">
                  <CopyIcon />
                </Button>
              </TextInputGroupUtilities>
            </TextInputGroup>
            <TextContent>
              If the package is not present on your server(s), follow these steps:{' '}
              <Button
                component="a"
                target="_blank"
                variant="link"
                icon={<ExternalLinkAltIcon />}
                iconPosition="right"
                isInline
                href={installServerPackagesLink}
              >
                Install server packages
              </Button>
            </TextContent>
          </Stack>
        </FormGroup>
      </Form>
    </React.Fragment>
  );
};

export default Page1;