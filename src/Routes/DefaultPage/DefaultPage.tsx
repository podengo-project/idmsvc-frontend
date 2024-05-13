import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { RegistryIcon } from '@patternfly/react-icons/dist/esm/icons/registry-icon';

import {
  Bullseye,
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Page,
  PageSection,
  Pagination,
  Spinner,
  Stack,
  StackItem,
  Toolbar, EmptyStateHeader,
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import './DefaultPage.scss';
import Section from '@redhat-cloud-services/frontend-components/Section';
import { Domain, ResourcesApiFactory } from '../../Api/api';
import { DomainList } from '../../Components/DomainList/DomainList';
import { AppContext } from '../../AppContext';

const Header = () => {
  const linkLearnMoreAbout = 'https://access.redhat.com/articles/1586893';
  const title = 'Directory and Domain Services';

  return (
    <PageHeader>
      <PageHeaderTitle title={title} />
      <p>
        Manage registered identity domains to leverage host access controls from your existing identity and access management.{' '}
        <Button
          component="a"
          target="_blank"
          variant="link"
          isInline
          icon={<ExternalLinkAltIcon />}
          iconPosition="right"
          href={linkLearnMoreAbout}
          ouiaId="LinkDefaultLearnMoreAbout1"
        >
          Learn more about the domain registry.
        </Button>
      </p>
    </PageHeader>
  );
};

const RegisterDomainButton = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  const handleOpenWizard = () => {
    appContext.wizard.setDomain({ domain_id: '', title: '', description: '' } as Domain);
    appContext.wizard.setToken('');
    appContext.wizard.setRegisteredStatus('initial');
    navigate('/domains/wizard', { replace: true });
  };

  return (
    <Button ouiaId="ButtonDefaultRegisterIdentityDomain" onClick={handleOpenWizard}>
      Register identity domain
    </Button>
  );
};

const EmptyContent = () => {
  // FIXME Update this link in the future
  const linkLearnMoreAbout = 'https://access.redhat.com/articles/1586893';

  return (
    <>
      <Section>
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateHeader titleText="No identity domains registered" icon={<EmptyStateIcon icon={RegistryIcon} />} headingLevel="h2" />
            <EmptyStateBody>
              <Stack>
                <StackItem className="pf-u-pt-sm">
                  Use host access controls from your existing identity domains in your
                  <br /> cloud environment*. To get started, register an identity domain.
                </StackItem>
                <StackItem className="pf-u-pt-md">
                  <RegisterDomainButton />
                </StackItem>
                <StackItem className="pf-u-pt-md">
                  <Button
                    component="a"
                    target="_blank"
                    variant="link"
                    isInline
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="right"
                    href={linkLearnMoreAbout}
                    ouiaId="LinkDefaultLearnMoreAbout2"
                  >
                    Learn more about registering identity domains{' '}
                  </Button>
                </StackItem>
                <StackItem className="pf-u-pt-lg pf-u-color-100">
                  *Only currently available for Red Hat Identity Management (IdM) deployments.
                </StackItem>
              </Stack>
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      </Section>
    </>
  );
};

interface ListContentProps {
  page: number;
  setPage: (value: number) => void;
  perPage: number;
  setPerPage: (value: number) => void;
  itemCount: number;
}

const ListContent = (props: ListContentProps) => {
  const { page, setPage, perPage, setPerPage, itemCount } = props;
  const offset = (page - 1) * perPage;

  return (
    <>
      <Page>
        <PageSection>
          <Card>
            <CardBody>
              <Toolbar>
                <Flex>
                  <FlexItem>
                    <RegisterDomainButton />
                  </FlexItem>
                </Flex>
              </Toolbar>
              <DomainList />
              <Pagination
                dropDirection="up"
                offset={offset}
                itemCount={itemCount}
                perPage={perPage}
                page={page}
                onSetPage={(_event, page) => setPage(page)}
                widgetId="top-example"
                onPerPageSelect={(_event, perPage) => setPerPage(perPage)}
                ouiaId="PaginationTop"
              />
            </CardBody>
          </Card>
        </PageSection>
      </Page>
    </>
  );
};

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 *
 * https://www.patternfly.org/v4/layouts/bullseye/
 *
 */
const DefaultPage = () => {
  const appContext = useContext(AppContext);
  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);

  // States
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const offset = (page - 1) * perPage;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log('INFO:DefaultPage render');

  useEffect(() => {
    setIsLoading(true);
    resources_api
      .listDomains(undefined, offset, perPage, undefined)
      .then((res) => {
        const domains: Domain[] = res.data.data;
        const count = res.data.meta.count;
        appContext.setListDomains(domains);
        appContext.setTotalDomains(count);
        setIsLoading(false);
      })
      .catch((reason) => {
        console.log(reason);
        setIsLoading(false);
      });
  }, [page, perPage]);

  const changePageSize = (size: number) => {
    setPerPage(size);
    setPage(1);
  };

  const listContent = (
    <>
      <Header />
      <ListContent page={page} setPage={setPage} perPage={perPage} setPerPage={changePageSize} itemCount={appContext.totalDomains} />
    </>
  );

  const emptyContent = (
    <>
      <Header />
      <EmptyContent />
    </>
  );

  const loadingContent = (
    <>
      <Header />
      <Bullseye>
        <Spinner />
      </Bullseye>
    </>
  );

  if (isLoading) {
    return loadingContent;
  }
  const content = appContext.totalDomains <= 0 ? emptyContent : listContent;
  return content;
};

export default DefaultPage;
