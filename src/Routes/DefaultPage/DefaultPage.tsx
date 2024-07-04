import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { RegistryIcon } from '@patternfly/react-icons/dist/esm/icons/registry-icon';

import {
  Bullseye,
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  PageGroup,
  PageSection,
  Pagination,
  Stack,
  StackItem,
  Toolbar,
} from '@patternfly/react-core';

import { SkeletonTable } from '@patternfly/react-component-groups';

import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import './DefaultPage.scss';
import Section from '@redhat-cloud-services/frontend-components/Section';
import { Domain, ResourcesApiFactory } from '../../Api/idmsvc';
import { DomainList } from '../../Components/DomainList/DomainList';
import { AppContext } from '../../AppContext';
import CenteredSpinner from '../../Components/CenteredSpinner/CenteredSpinner';
import useIdmPermissions from '../../Hooks/useIdmPermissions';
import NoPermissions from '../../Components/NoPermissions/NoPermissions';

const Header = () => {
  const title = 'Directory and Domain Services';

  return (
    <PageHeader>
      <PageHeaderTitle title={title} />
      <p>Register identity and access management systems to enable machines to automatically join a domain.</p>
    </PageHeader>
  );
};

const RegisterDomainButton = () => {
  const appContext = useContext(AppContext);
  const rbac = useIdmPermissions();
  const navigate = useNavigate();

  const handleOpenWizard = () => {
    appContext.wizard.setDomain({ domain_id: '', title: '', description: '' } as Domain);
    appContext.wizard.setToken('');
    appContext.wizard.setRegisteredStatus('initial');
    navigate('/domains/wizard', { replace: true });
  };

  const isDisabled = rbac.isLoading || !rbac.permissions.hasTokenCreate || !rbac.permissions.hasDomainsUpdate;

  return (
    <Button ouiaId="ButtonDefaultRegisterIdentityDomain" onClick={handleOpenWizard} isLoading={rbac.isLoading} isDisabled={isDisabled}>
      Register identity domain
    </Button>
  );
};

const EmptyContent = () => {
  return (
    <>
      <Section>
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateHeader titleText="No identity domains registered" icon={<EmptyStateIcon icon={RegistryIcon} />} headingLevel="h2" />
            <EmptyStateBody>
              <Stack>
                <StackItem className="pf-v5-u-pt-sm">
                  Register an identity domain to enable systems to
                  <br /> automatically join the domain on launch.
                </StackItem>
                <StackItem className="pf-v5-u-pt-md">
                  <RegisterDomainButton />
                </StackItem>
                <StackItem className="pf-v5-u-pt-md"></StackItem>
                <StackItem className="pf-v5-u-pt-lg pf-v5-u-color-100">
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
  isLoading: boolean;
}

const ListContent = (props: ListContentProps) => {
  const { page, setPage, perPage, setPerPage, itemCount } = props;

  let table: React.ReactNode = null;
  if (props.isLoading) {
    table = <SkeletonTable rows={itemCount || 4} columns={['Name', 'UUID', 'Type', 'Domain auto-join on launch', 'Actions']} />;
  } else {
    table = <DomainList />;
  }

  return (
    <>
      <PageGroup>
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
              {table}
              <Pagination
                className="pf-u-mt-md"
                dropDirection="up"
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
      </PageGroup>
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
  const rbac = useIdmPermissions();

  const hasPermissions = !rbac.isLoading && rbac.permissions.hasDomainsList;

  console.log('INFO:DefaultPage render');

  useEffect(() => {
    if (!hasPermissions) {
      return;
    }
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
  }, [page, perPage, hasPermissions]);

  const changePageSize = (size: number) => {
    setPerPage(size);
    setPage(1);
  };

  if (!rbac.isLoading && !hasPermissions) {
    return <NoPermissions />;
  }

  const firstTimeLoading = isLoading && !appContext.totalDomains;
  if (rbac.isLoading || firstTimeLoading) {
    return (
      <>
        <Header />
        <CenteredSpinner />
      </>
    );
  }

  if (!isLoading && appContext.totalDomains <= 0) {
    return (
      <>
        <Header />
        <EmptyContent />
      </>
    );
  }

  return (
    <>
      <Header />
      <ListContent
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={changePageSize}
        itemCount={appContext.totalDomains}
        isLoading={isLoading}
      />
    </>
  );
};

export default DefaultPage;
