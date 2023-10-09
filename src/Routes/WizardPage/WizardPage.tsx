/**
 * This library implement the WizardPage.
 *
 * The goal is provide the steps to register and add
 * a new domain service.
 */
import React, { useContext, useState } from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';

import { Button, Page, PageSection, PageSectionTypes, PageSectionVariants, Wizard, WizardStep } from '@patternfly/react-core';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import './WizardPage.scss';
import { useNavigate } from 'react-router-dom';
import { Domain, ResourcesApiFactory } from '../../Api/api';
import { AppContext } from '../../AppContext';
import { VerifyState } from './Components/VerifyRegistry/VerifyRegistry';

// Lazy load for the wizard pages
const PagePreparation = React.lazy(() => import('./Components/PagePreparation/PagePreparation'));
const PageServiceRegistration = React.lazy(() => import('./Components/PageServiceRegistration/PageServiceRegistration'));
const PageServiceDetails = React.lazy(() => import('./Components/PageServiceDetails/PageServiceDetails'));
const PageReview = React.lazy(() => import('./Components/PageReview/PageReview'));

/**
 * Wizard page to register a new domain into the service.
 * @see {@link PagePreparation} about the preparation page.
 * @see {@link PageServiceRegistration} about the registration page.
 * @see {@link PageServiceDetails} about the details page.
 * @see {@link PageReview} about the review page.
 */
const WizardPage = () => {
  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);
  const appContext = useContext(AppContext);
  const domain = appContext.wizard.getDomain();
  const navigate = useNavigate();

  // FIXME Update the URL with the location for docs
  const linkLearnMoreAbout = 'https://access.redhat.com/articles/1586893';

  /** Event triggered when Close button is clicked. */
  const onCloseClick = () => {
    // TODO A few things pending:
    //       - Modal confirmation
    //         - Confirm =>
    //           - if not registered, dismiss wizard
    //           - else => DELETE /domains/:domain_id
    //         - Cancel or close model => Do not dismiss wizard
    if (domain.domain_id) {
      resources_api
        .updateDomainUser(domain.domain_id, {
          title: domain.title,
          description: domain.description,
          auto_enrollment_enabled: domain.auto_enrollment_enabled,
        })
        .then((response) => {
          if (response.status >= 400) {
            // TODO show-up notification with error message
          }
        })
        .catch((error) => {
          // TODO show-up notification with error message
          console.log('error onClose: ' + error);
        });
    }
    navigate('/domains');
  };

  /** Event triggered when Back button is clicked. */
  const onPreviousPage = (
    _newStep: { id?: string | number; name: React.ReactNode },
    _prevStep: { prevId?: string | number; prevName: React.ReactNode }
  ) => {
    // TODO If not needed at the end clean-up onPreviousPage
    console.log('onPreviousPage fired');
    return;
  };

  /** Event triggered when a specific page is clicked. */
  const onGoToStep = (
    _newStep: { id?: string | number; name: React.ReactNode },
    _prevStep: { prevId?: string | number; prevName: React.ReactNode }
  ) => {
    // TODO If not needed at the end clean-up onPreviousPage
    console.log('onGoToStep fired');
    return;
  };

  /** Event triggered when the Next button is clicked. */
  const onNextPage = async ({ id }: WizardStep) => {
    // FIXME Delete log
    console.log('onNextPage fired for id=' + id);
    if (id === undefined) {
      return;
    }
    if (typeof id === 'string') {
      const [, orderIndex] = id.split('-');
      id = parseInt(orderIndex);
    }
  };

  const initCanJumpPage1 = true;
  const initCanJumpPage2 = initCanJumpPage1 && domain.domain_id != '' && appContext.wizard.getToken() != '';
  const initCanJumpPage3 = initCanJumpPage2 && appContext.wizard.getRegisteredStatus() === 'completed';
  const initCanJumpPage4 = initCanJumpPage3 && domain.title !== undefined && domain.title.length > 0;

  const [canJumpPage1] = useState<boolean>(initCanJumpPage1);
  const [canJumpPage2, setCanJumpPage2] = useState<boolean>(initCanJumpPage2);
  const [canJumpPage3, setCanJumpPage3] = useState<boolean>(initCanJumpPage3);
  const [canJumpPage4, setCanJumpPage4] = useState<boolean>(initCanJumpPage4);

  const onToken = (token: string, domain_id: string, expiration: number) => {
    console.log('WizardPage.OnToken fired: token=' + token + '; domain_id=' + domain_id + '; expiration=' + expiration);
    if (token != '') {
      setCanJumpPage2(true);
    } else {
      setCanJumpPage2(false);
    }
  };

  const onVerify = (value: VerifyState, data?: Domain) => {
    appContext.wizard.setRegisteredStatus(value);
    if (value === 'completed') {
      data && appContext.wizard.setDomain(data);
      setCanJumpPage3(true);
    } else {
      setCanJumpPage3(false);
    }
  };

  const onChangeTitle = (value: string) => {
    appContext.wizard.setDomain({ ...domain, title: value });
    if (value.length > 0) {
      setCanJumpPage4(true);
    } else {
      setCanJumpPage4(false);
    }
  };

  const onChangeDescription = (value: string) => {
    appContext.wizard.setDomain({ ...domain, description: value });
  };

  const onChangeAutoEnrollment = (value: boolean) => {
    appContext.wizard.setDomain({ ...domain, auto_enrollment_enabled: value });
  };

  /** Configure the wizard pages. */
  const steps: WizardStep[] = [
    {
      // This page only display the pre-requisites
      id: 1,
      name: 'Preparation',
      component: <PagePreparation onToken={onToken} />,
      canJumpTo: canJumpPage1,
      enableNext: canJumpPage2,
    },
    {
      id: 2,
      name: 'Domain registration',
      component: <PageServiceRegistration uuid={domain.domain_id ? domain.domain_id : ''} token={appContext.wizard.getToken()} onVerify={onVerify} />,
      canJumpTo: canJumpPage2,
      enableNext: canJumpPage3,
    },
    {
      id: 3,
      name: 'Domain information',
      component: (
        <PageServiceDetails
          title={domain.title}
          description={domain.description}
          autoEnrollmentEnabled={domain.auto_enrollment_enabled}
          onChangeTitle={onChangeTitle}
          onChangeDescription={onChangeDescription}
          onChangeAutoEnrollment={onChangeAutoEnrollment}
        />
      ),
      canJumpTo: canJumpPage3,
      enableNext: canJumpPage4,
    },
    {
      id: 4,
      name: 'Review',
      component: <PageReview domain={domain} />,
      nextButtonText: 'Finish',
      canJumpTo: canJumpPage4,
      enableNext: true,
    },
  ];

  const title = 'Register identity domain';

  return (
    <>
      <Page>
        <PageHeader>
          <PageHeaderTitle title={title} />
          <p>
            Add an identity domain to the registry.{' '}
            <Button
              component="a"
              target="_blank"
              variant="link"
              isInline
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
              href={linkLearnMoreAbout}
            >
              Learn more about registering identity domains{' '}
            </Button>
          </p>
        </PageHeader>
        <PageSection type={PageSectionTypes.wizard} variant={PageSectionVariants.light}>
          <Wizard
            navAriaLabel={`${title} steps`}
            mainAriaLabel={`${title} content`}
            steps={steps}
            onClose={onCloseClick}
            onNext={onNextPage}
            onBack={onPreviousPage}
            onGoToStep={onGoToStep}
          />
        </PageSection>
      </Page>
    </>
  );
};

export default WizardPage;
