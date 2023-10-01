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

// Lazy load for the wizard pages
const PagePreparation = React.lazy(() => import('./Components/PagePreparation/PagePreparation'));
const PageServiceRegistration = React.lazy(() => import('./Components/PageServiceRegistration/PageServiceRegistration'));
const PageServiceDetails = React.lazy(() => import('./Components/PageServiceDetails/PageServiceDetails'));
const PageReview = React.lazy(() => import('./Components/PageReview/PageReview'));

const initialDomain: Domain = {
  domain_id: '14f3a7a4-32c5-11ee-b40f-482ae3863d30',
  domain_name: 'mydomain.example',
  auto_enrollment_enabled: true,
  title: 'My Domain',
  description: 'My Domain Description',
  domain_type: 'rhel-idm',
  'rhel-idm': {
    realm_name: '',
    realm_domains: [],
    ca_certs: [],
    servers: [],
    locations: [],
  },
};

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
    // FIXME A few things pending:
    //       - Mocal confirmation
    //         - Confirm =>
    //           - if not registered, dismiss wizard
    //           - else => DELETE /domains/:domain_id
    //         - Cancel or close model => Do not dismiss wizard
    navigate('/domains');
  };

  /** Event triggered when Back button is clicked. */
  const onPreviousPage = (
    _newStep: { id?: string | number; name: React.ReactNode },
    _prevStep: { prevId?: string | number; prevName: React.ReactNode }
  ) => {
    console.log('onPreviousPage fired');
    return;
  };

  /** Event triggered when a specific page is clicked. */
  const onGoToStep = (
    _newStep: { id?: string | number; name: React.ReactNode },
    _prevStep: { prevId?: string | number; prevName: React.ReactNode }
  ) => {
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
  const initCanJumpPage3 = initCanJumpPage2;
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

  /** Configure the wizard pages. */
  const steps = [
    {
      // This page only display the pre-requisites
      id: 1,
      name: 'Preparation',
      component: <PagePreparation onToken={onToken} />,
      canJumpTo: canJumpPage1,
    },
    {
      id: 2,
      name: 'Service registration',
      // FIXME Pass here the 'registering.domain' field from the context
      // FIXME Pass here the 'registering.token' field from the context
      component: <PageServiceRegistration data={domain} />,
      canJumpTo: canJumpPage2,
    },
    {
      id: 3,
      name: 'Service details',
      // FIXME Pass here the 'registering.domain' field from the context
      component: <PageServiceDetails data={domain} />,
      canJumpTo: canJumpPage3,
    },
    {
      id: 4,
      name: 'Review',
      // FIXME Pass here the 'registering.domain' field from the context
      component: <PageReview data={domain} />,
      canJumpTo: canJumpPage4,
    },
  ];

  const title = 'Register directory and domain service';

  return (
    <>
      <Page>
        <PageHeader>
          <PageHeaderTitle title={title} />
          <p>
            Add a service to the registry.{' '}
            <Button
              component="a"
              target="_blank"
              variant="link"
              isInline
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
              href={linkLearnMoreAbout}
            >
              Learn more about the directory and domain services{' '}
            </Button>
          </p>
        </PageHeader>
        <PageSection type={PageSectionTypes.wizard} variant={PageSectionVariants.light}>
          <Wizard navAriaLabel={`${title} steps`} mainAriaLabel={`${title} content`} steps={steps} onClose={onCloseClick} />
        </PageSection>
      </Page>
    </>
  );
};

export default WizardPage;
