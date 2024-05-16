import React, { useState } from 'react';
import { Alert, Button, ClipboardCopy, Flex, FlexItem, Form, TextContent, Title } from '@patternfly/react-core';

import './PageServiceRegistration.scss';
import VerifyRegistry, { VerifyState } from '../VerifyRegistry/VerifyRegistry';
import { Domain } from '../../../../Api';

/**
 * Represents the properties accepted by the @{link PageServiceRegistration} component.
 * @see @{link VerifyState} about the different states.
 */
interface PageServiceRegistrationProp {
  /** The uuid for the requested token. */
  uuid: string;
  /** The token requested for the operation. */
  token: string;
  /** Event fired when the registration state changes. */
  onVerify?: (value: VerifyState, data?: Domain) => void;
}

/**
 * Represent the page that provide the registration command and check
 * when the registration happened from the user.
 * @param props provide the uuid and token for the registration process.
 * @returns the view for the page updated according the registration
 * information.
 * @see {@link PageServiceRegistrationProp} about the accepted properties.
 * @see {@link WizardPage} about the parent component.
 * @public
 */
const PageServiceRegistration = (props: PageServiceRegistrationProp) => {
  // FIXME Update the URL with the location for docs
  // const installServerPackagesLink = 'https://freeipa.org/page/Quick_Start_Guide';
  const [state, setState] = useState<VerifyState>('initial');

  // FIXME Clean-up when sure it is not needed
  // const openInNewWindow = (url: string) => {
  //   window.open(url, '_blank');
  // };

  // FIXME Clean-up when sure it is not needed
  // const onInstallServerPackagesClick = () => {
  //   openInNewWindow(installServerPackagesLink);
  // };

  const ipa_hcc_register_cmd = 'ipa-hcc register ' + props.token;
  const alertTitle = 'Register your identity domain';

  // FIXME Update the URL with the location for docs
  const linkLearnMoreAbout = 'https://www.google.es/search?q=freeipa+registering+a+domain+service';

  const onChangeVerifyRegistry = (newState: VerifyState, domain?: Domain) => {
    setState(newState);
    if (props.onVerify) {
      props.onVerify(newState, domain);
    }
  };

  console.log('PageServiceRegistration: uuid=' + props.uuid + '; token=' + props.token);

  return (
    <>
      <Title headingLevel={'h2'} ouiaId="TitleWizardRegistration">
        Register your identity domain
      </Title>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Alert title={alertTitle} variant="warning" isInline className="pf-v5-u-mt-lg" ouiaId="AlertWizardRegistrationNote">
          Completing this step registers your identity domain, and cannot be undone from the wizard.{' '}
          <div className="pf-v5-u-mt-md">
            <Button component="a" target="_blank" variant="link" isInline href={linkLearnMoreAbout} ouiaId="LinkWizardRegistrationLearnMore">
              Learn more about registering identity domains
            </Button>
          </div>
        </Alert>
        <ol>
          <li className="pf-v5-u-ml-md">
            <TextContent>
              Register your Red Hat IdM domain with the Red Hat Hybrid Cloud Console by running the following command as <code>root</code> in a
              terminal on your Red Hat IdM server, and following the prompts.
            </TextContent>
            <ClipboardCopy hoverTip="copy" clickTip="Copied" isReadOnly ouiaId="TextWizardRegistrationRegister">
              {ipa_hcc_register_cmd}
            </ClipboardCopy>
          </li>
          <li className="pf-v5-u-ml-md pf-v5-u-pt-md">
            <TextContent>After the command completes, verify the registration was successful.</TextContent>
          </li>
        </ol>
      </Form>
      <Flex>
        <FlexItem>
          <VerifyRegistry uuid={props.uuid} onChange={onChangeVerifyRegistry} state={state} />
        </FlexItem>
      </Flex>
    </>
  );
};

export default PageServiceRegistration;
