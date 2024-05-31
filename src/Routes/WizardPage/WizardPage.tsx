/**
 * This library implement the WizardPage.
 *
 * The goal is provide the steps to register and add
 * a new domain service.
 */
import React, { useContext, useEffect, useState } from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';

import { Button, Modal, ModalVariant, PageGroup, PageSection, PageSectionVariants, Text, Wizard, WizardStep } from '@patternfly/react-core';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import './WizardPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import { Domain, ResourcesApiFactory } from '../../Api/idmsvc';
import { AppContext } from '../../AppContext';
import { VerifyState } from './Components/VerifyRegistry/VerifyRegistry';
import useNotification from '../../Hooks/useNotification';

import PagePreparation from './Components/PagePreparation/PagePreparation';
import PageServiceRegistration from './Components/PageServiceRegistration/PageServiceRegistration';
import PageServiceDetails from './Components/PageServiceDetails/PageServiceDetails';
import PageReview from './Components/PageReview/PageReview';
import CenteredSpinner from '../../Components/CenteredSpinner/CenteredSpinner';
import useIdmPermissions from '../../Hooks/useIdmPermissions';

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
  const domain = appContext?.wizard.domain;
  const navigate = useNavigate();
  const { notifySuccess, notifyWarning, notifyError, removeNotification } = useNotification();
  const [isCancelConfirmationModalOpen, SetIsCancelConfirmationModalOpen] = useState<boolean>(false);
  const rbac = useIdmPermissions();

  // FIXME Update the URL with the location for docs
  const linkLearnMoreAbout = 'https://access.redhat.com/articles/1586893';
  const linkLearnMoreAboutRemovingDirectoryAndDomainServices = 'https://access.redhat.com/articles/1586893';

  useEffect(() => {
    if (!rbac.isLoading && (!rbac.permissions.hasTokenCreate || !rbac.permissions.hasDomainsUpdate)) {
      navigate('/no-permissions', { replace: true });
      return;
    }
  }, [rbac]);

  const notifyNotCompleted = () => {
    const notificationID = 'domain-registration-cancelled-notification';
    notifyError({
      id: notificationID,
      title: 'Identity domain registration could not be completed',
      description: (
        <>
          <p>You will need to re-launch the &quot;Register identity domain&quot; wizard.</p>
          <p>
            <Link to="/domains/wizard" onClick={() => removeNotification(notificationID)}>
              Relaunch the wizard
            </Link>
          </p>
        </>
      ),
    });
  };

  const notifyDomainRegistrationSuccess = () => {
    if (!domain) return;

    if (domain.auto_enrollment_enabled) {
      notifySuccess({
        title: 'Identity domain registration created and enabled',
      });
    } else {
      notifyWarning({
        title: 'Identity domain registration created but not enabled',
        description: (
          <>
            <p>You can enable &quot;Domain auto-join on launch&quot; in the registry list.</p>
          </>
        ),
      });
    }
  };

  const notifyDomainRegistrationError = () => {
    notifyError({
      title: 'Issue occurred when finishing the domain registration',
      description: (
        <>
          <p>Check domain in the registry list.</p>
        </>
      ),
    });
  };

  /** Event triggered when we do click on continue button at cancel confirmation modal */
  const onConfirmCancelWizardContinueButtonClick = () => {
    SetIsCancelConfirmationModalOpen(false);
  };

  const dismissCancelConfirmationAndGoToDefaultView = () => {
    SetIsCancelConfirmationModalOpen(false);
    navigate('/domains');
  };

  const onConfirmCancelWizardCancelButtonClick = () => {
    if (domain?.domain_id) {
      resources_api
        .deleteDomain(domain?.domain_id)
        .then((result) => {
          if (result.status === 204 || result.status === 404) {
            dismissCancelConfirmationAndGoToDefaultView();
            notifyNotCompleted();
          } else {
            dismissCancelConfirmationAndGoToDefaultView();
            notifyNotCompleted();
          }
        })
        .catch(() => {
          dismissCancelConfirmationAndGoToDefaultView();
          notifyNotCompleted();
        });
    } else {
      dismissCancelConfirmationAndGoToDefaultView();
      notifyNotCompleted();
    }
  };

  /** Event triggered when Finish button is clicked. */
  const onWizardSave = () => {
    console.log('onWizardSave fired');
    if (domain?.domain_id) {
      const domain_id: string = domain?.domain_id;
      resources_api
        .updateDomainUser(domain_id, {
          title: domain?.title,
          description: domain?.description,
          auto_enrollment_enabled: domain?.auto_enrollment_enabled,
        })
        .then((response) => {
          if (response.status >= 400) {
            notifyDomainRegistrationError();
          } else {
            notifyDomainRegistrationSuccess();
          }
          navigate('/domains');
        })
        .catch(() => {
          notifyDomainRegistrationError();
          navigate('/domains');
        });
    } else {
      notifyDomainRegistrationError();
      navigate('/domains');
    }
  };

  /** Event triggered when Cancel button is clicked on the wizard. */
  const onWizardClose = () => {
    console.log('onWizardClose fired');
    SetIsCancelConfirmationModalOpen(true);
  };

  const initCanJumpPage1 = true;
  const initCanJumpPage2 = initCanJumpPage1 && domain?.domain_id != '' && appContext?.wizard.token != '';
  const initCanJumpPage3 = initCanJumpPage2 && appContext?.wizard.registeredStatus === 'completed';
  const initCanJumpPage4 = initCanJumpPage3 && domain?.title !== undefined && domain.title.length > 0;

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
    if (appContext?.wizard.registeredStatus === 'completed') {
      // verify was previously completed (e.g. user stepped the wizard
      // back to the token page.  Do not overwrite the domain value,
      // so that we do not discard any user-specified settings.
      return;
    }
    appContext?.wizard.setRegisteredStatus(value);
    if (value === 'completed' && data !== undefined) {
      data.auto_enrollment_enabled = true;
      appContext?.wizard.setDomain(data);
      setCanJumpPage3(true);
      // Check whether initial values for user-configurable fields
      // are valid.  They should be, which will enable the user to
      // accept the defaults as-is.
      onUserInputChange(data);
    } else {
      setCanJumpPage3(false);
    }
  };

  // User changed an input that could affect data validity.
  // Check validity and set "Next" button state accordingly.
  const onUserInputChange = (domain: Domain): void => {
    const good = domain.title ? domain.title.length > 0 : false;
    setCanJumpPage4(good);
  };

  const onChangeTitle = (value: string) => {
    if (domain !== undefined) {
      const newDomain: Domain = { ...domain, title: value };
      appContext?.wizard.setDomain(newDomain);
      onUserInputChange(newDomain);
    }
  };

  const onChangeDescription = (value: string) => {
    if (domain !== undefined) {
      appContext?.wizard.setDomain({ ...domain, description: value });
    }
  };

  const onChangeAutoEnrollment = (value: boolean) => {
    if (domain !== undefined) {
      appContext?.wizard.setDomain({ ...domain, auto_enrollment_enabled: value });
    }
  };

  const title = 'Register identity domain';

  if (rbac.isLoading) {
    return <CenteredSpinner />;
  }

  return (
    <>
      <PageGroup>
        <PageHeader>
          <PageHeaderTitle title={title} ouiaId="TextWizardTitle" />
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
              ouiaId="LinkWizardHeaderLearnAbout"
            >
              Learn more about registering identity domains{' '}
            </Button>
          </p>
        </PageHeader>
        <PageSection type={'wizard'} variant={PageSectionVariants.light}>
          <Wizard navAriaLabel={`${title} steps`} isVisitRequired={true} onClose={onWizardClose} onSave={onWizardSave}>
            <WizardStep
              id="wizard-nav-preparation"
              name="preparation"
              isDisabled={!canJumpPage1}
              navItem={{
                content: 'Preparation',
              }}
              footer={{
                isNextDisabled: !canJumpPage2,
              }}
            >
              <PagePreparation onToken={onToken} />
            </WizardStep>
            <WizardStep
              id="wizard-nav-registration"
              name="registration"
              isDisabled={!canJumpPage2}
              navItem={{
                content: 'Registration',
              }}
              footer={{
                isNextDisabled: !canJumpPage3,
              }}
            >
              <PageServiceRegistration uuid={domain?.domain_id ? domain?.domain_id : ''} token={appContext?.wizard.token || ''} onVerify={onVerify} />
            </WizardStep>
            <WizardStep
              id="wizard-nav-details"
              name="details"
              isDisabled={!canJumpPage3}
              navItem={{
                content: 'Details',
              }}
              footer={{
                isNextDisabled: !canJumpPage4,
              }}
            >
              <PageServiceDetails
                title={domain?.title}
                description={domain?.description}
                autoEnrollmentEnabled={domain?.auto_enrollment_enabled}
                onChangeTitle={onChangeTitle}
                onChangeDescription={onChangeDescription}
                onChangeAutoEnrollment={onChangeAutoEnrollment}
              />
            </WizardStep>
            <WizardStep
              id="wizard-nav-review"
              name="review"
              isDisabled={!canJumpPage4}
              navItem={{
                content: 'Review',
              }}
              footer={{ nextButtonText: 'Finish' }}
            >
              <PageReview domain={domain || ({} as Domain)} />
            </WizardStep>
          </Wizard>
          <Modal
            variant={ModalVariant.small}
            title="Cancel identity domain registration"
            titleIconVariant={'warning'}
            isOpen={isCancelConfirmationModalOpen}
            onClose={onConfirmCancelWizardContinueButtonClick}
            ouiaId="ModalCancelRegistration"
            actions={[
              <Button key="cancel" variant="primary" onClick={onConfirmCancelWizardCancelButtonClick} ouiaId="ButtonModalCancelRegistrationCancel">
                Cancel registration
              </Button>,
              <Button key="continue" variant="link" onClick={onConfirmCancelWizardContinueButtonClick} ouiaId="ButtonModalCancelRegistrationContinue">
                Continue registration
              </Button>,
            ]}
          >
            <Text>
              Proceeding with the cancellation, your data will not be saved in the Red Hat Hybrid Cloud Console. However, this action does not affect
              the identity server side if any action is done there.
            </Text>
            <Button
              component="a"
              target="_blank"
              variant="link"
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
              isInline
              href={linkLearnMoreAboutRemovingDirectoryAndDomainServices}
              ouiaId="ButtonPagePreparationPrerequisites"
            >
              Learn more about removing Directory and Domain Services Packages from your Red hat IdM server
            </Button>
          </Modal>
        </PageSection>
      </PageGroup>
    </>
  );
};

export default WizardPage;
