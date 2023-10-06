import React, { useContext, useEffect, useState } from 'react';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import { Button, ClipboardCopy, Form, FormGroup, Icon, Select, SelectOption, TextContent, Title } from '@patternfly/react-core';

import './PagePreparation.scss';
import { DomainType, ResourcesApiFactory } from '../../../../Api';
import { AppContext, IAppContext } from '../../../../AppContext';

/** Represent the properties for PagePreparation component. */
interface PagePreparationProps {
  token?: string;
  onToken?: (token: string, domain_id: string, expiration: number) => void;
}

/**
 * This page provide information and links to prepare the rhel-idm
 * servers before the user could proceed to the registration process.
 * @param props provide the token value and the onToken event to
 * notify when it is created.
 * @returns Return the view to inform the user how to prepare for
 * the domain registration.
 * @public
 * @see {@link PagePreparationProps} to know about the properties.
 * @see {@link WizardPage} to know about the parent component.
 */
const PagePreparation = (props: PagePreparationProps) => {
  // FIXME Update the target link when it is known
  const installServerPackagesLink = 'https://duckduckgo.com/?q=freeipa+prerequisites';
  // FIXME Update the target link when it is known
  const prerequisitesLink = 'https://www.google.com?q=rhel-idm+pre-requisites';

  // States
  const [isOpen, setIsOpen] = useState(false);
  const appContext = useContext<IAppContext>(AppContext);

  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);

  const token = appContext.wizard.getToken();
  const domain = appContext.wizard.getDomain();
  const domain_id = domain.domain_id ? domain.domain_id : '';

  /**
   * side effect to retrieve a token in the background.
   * TODO When more than one type of domain, this callback will
   * invoke from 'onRegisterDomainTypeSelect' event.
   */
  useEffect(() => {
    if (token != '' && domain_id != '') {
      return;
    }
    // NOTE await and async cannot be used directly because EffectCallback cannot be a Promise
    resources_api
      .createDomainToken({ domain_type: 'rhel-idm' }, undefined, undefined)
      .then((value) => {
        appContext.wizard.setToken(value.data.domain_token);
        const domain_id = value.data.domain_id;
        const domain_name = 'My domain';
        const domain_type = value.data.domain_type;
        const token = value.data.domain_token;
        const expiration = value.data.expiration;
        appContext.wizard.setDomain({
          domain_id: domain_id,
          domain_name: domain_name,
          domain_type: domain_type,
        });
        props.onToken?.(token, domain_id, expiration);
      })
      .catch((reason) => {
        // FIXME handle the error here
        console.log('error creating the token by createDomainToken: ' + reason);
      });
  }, [token, domain_id]);

  const onRegisterDomainTypeSelect = () => {
    // TODO Not implemented, currently only support rhel-idm
    console.debug('PagePreparation.onRegisterDomainTypeSelect in WizardPage');
    return;
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const domainOptions = [
    {
      value: 'rhel-idm' as DomainType,
      title: 'RHEL IdM (IPA)',
    },
  ];

  return (
    <>
      <Title headingLevel={'h2'}>Preparation for your directory and domain service</Title>
      <Form
        onSubmit={(value) => {
          console.debug('TODO onSubmit WizardPage' + String(value));
        }}
      >
        <FormGroup
          label="Service type"
          fieldId="register-domain-type"
          className="pf-u-mt-lg"
          helperText={
            <TextContent style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Icon status="info" isInline>
                <InfoCircleIcon />
              </Icon>{' '}
              Only RHEL IdM (IPA) are currently supported.
            </TextContent>
          }
        ></FormGroup>
        <FormGroup label="Service prerequisites">
          <ol>
            <li className="pf-u-pt-sd pf-u-ml-md">
              Complete the{' '}
              <Button
                component="a"
                target="_blank"
                variant="link"
                icon={<ExternalLinkAltIcon />}
                iconPosition="right"
                isInline
                href={prerequisitesLink}
              >
                prerequisites
              </Button>
            </li>
            <li className="pf-u-pt-md pf-u-ml-md">
              <TextContent>Verify whether or not the package is present on your server(s) with this command:</TextContent>
              <ClipboardCopy hoverTip="copy" clickTip="Copied" isReadOnly>
                dnf list installed ipa-hcc-server
              </ClipboardCopy>
              <TextContent className="pf-u-pt-md">
                If the package is not present on your server(s), follow these{' '}
                <Button
                  component="a"
                  target="_blank"
                  variant="link"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  isInline
                  href={installServerPackagesLink}
                >
                  steps to install the server packages
                </Button>
                <ClipboardCopy hoverTip="copy" clickTip="Copied" isReadOnly>
                  dnf copr enable copr.devel.redhat.com/cheimes/ipa-hcc && dnf install ipa-hcc-server
                </ClipboardCopy>
              </TextContent>
              <TextContent className="pf-u-pt-md">
                The package must be installed on at least one IPA server. For redundency, the package should be installed on two or more IPA servers,
                possibly all IPA servers.
              </TextContent>
            </li>
          </ol>
        </FormGroup>
      </Form>
    </>
  );
};

export default PagePreparation;
