import React, { useContext, useEffect } from 'react';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { Alert, Button, ClipboardCopy, Form, FormGroup, TextContent, Title } from '@patternfly/react-core';

import './PagePreparation.scss';
import { ResourcesApiFactory } from '../../../../Api';
import { AppContext, AppContextType } from '../../../../AppContext';

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
  const appContext = useContext<AppContextType | undefined>(AppContext);

  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);

  const token = appContext?.wizard.token;
  const domain = appContext?.wizard.domain;
  const domain_id = domain?.domain_id ? domain.domain_id : '';

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
        if (appContext !== undefined) {
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
        }
      })
      .catch((reason) => {
        // FIXME handle the error here
        console.log('error creating the token by createDomainToken: ' + reason);
      });
  }, [token, domain_id]);

  return (
    <>
      <Title headingLevel={'h2'}>Preparation for your identity domain registration</Title>
      <Form
        onSubmit={(value) => {
          console.debug('TODO onSubmit WizardPage' + String(value));
        }}
      >
        <FormGroup label="Identity domain type" fieldId="register-domain-type" className="pf-u-mt-lg">
          <Alert title={'Only Red Hat Identity Management (IdM) is currently supported.'} variant="info" isInline></Alert>
        </FormGroup>
        <FormGroup label="Identity domain prerequisites">
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
              <TextContent>
                Verify whether or not the package is present on your Red Hat IdM server(s) by running the following command in a terminal on your Red
                Hat IdM server(s):
              </TextContent>
              <ClipboardCopy hoverTip="copy" clickTip="Copied" isReadOnly>
                dnf list installed ipa-hcc-server
              </ClipboardCopy>
              <TextContent className="pf-u-pt-md">
                If the package is not present on your Red Hat IdM server(s), follow these{' '}
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
                The package must be installed on at least one Red Hat IdM server. For redundancy, the package should be installed on two or more Red
                Hat IdM servers.
              </TextContent>
            </li>
          </ol>
        </FormGroup>
      </Form>
    </>
  );
};

export default PagePreparation;
