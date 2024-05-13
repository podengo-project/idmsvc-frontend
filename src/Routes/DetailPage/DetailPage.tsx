import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { Card, CardBody, Flex, FlexItem, Page, PageSection, Tab, TabTitleText, Tabs } from '@patternfly/react-core';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core/deprecated';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import './DetailPage.scss';
import { Domain, ResourcesApiFactory } from '../../Api/api';
import { AppContext } from '../../AppContext';
import { DetailGeneral } from './Components/DetailGeneral/DetailGeneral';
import { DetailServers } from './Components/DetailServers/DetailServers';
import ConfirmDeleteDomain from '../../Components/ConfirmDeleteDomain/ConfirmDeleteDomain';
import useNotification from '../../Hooks/useNotification';
import { buildDeleteFailedNotification, buildDeleteSuccessNotification } from './detailNotifications';

/**
 * It represents the detail page to show the information about a
 * registered domain.
 * @see https://stackoverflow.com/questions/75522048/react-how-to-access-urls-parameters
 * @see https://reactrouter.com/en/main/hooks/use-params
 */
const DetailPage = () => {
  const appContext = useContext(AppContext);
  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useNotification();

  // Params
  const { domain_id } = useParams();

  if (domain_id === undefined) {
    navigate('/domains', { replace: true });
    return <></>;
  }

  // States
  const [domain, setDomain] = useState<Domain | undefined>(appContext?.getDomain(domain_id) || undefined);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState<boolean>(false);

  console.log('INFO:DetailPage render:domain_id=' + domain_id);

  // Load Domain to display
  useEffect(() => {
    if (domain_id) {
      resources_api
        .readDomain(domain_id)
        .then((res) => {
          if (res.status === 200) {
            appContext?.updateDomain(res.data);
            setDomain(res.data);
          }
        })
        .catch((reason) => {
          console.log(reason);
          console.error('Failed to load domain');
          navigate('/domains', { replace: true });
        });
    }
  }, [domain_id]);

  // Kebab menu
  const [isKebabOpen, setIsKebabOpen] = useState<boolean>(false);

  const onKebabToggle = (
    isOpen: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: MouseEvent | TouchEvent | KeyboardEvent | React.KeyboardEvent<any> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setIsKebabOpen(isOpen);
  };

  const onKebabSelect = (event?: React.SyntheticEvent<HTMLDivElement>): void => {
    event?.stopPropagation();
    setIsKebabOpen(!isKebabOpen);
  };

  const OnShowConfirmDelete = () => {
    setIsOpenConfirmDelete(true);
  };

  const onDismissConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };

  const onDelete = (domain?: Domain) => {
    if (domain?.domain_id !== undefined) {
      const domainId = domain.domain_id;
      resources_api
        .deleteDomain(domainId)
        .then((response) => {
          if (response.status == 204) {
            appContext?.deleteDomain(domainId);
            notifySuccess(buildDeleteSuccessNotification(domain));
            navigate('/domains', { replace: true });
          } else {
            notifyError(buildDeleteFailedNotification(domain));
            console.error(`response.status=${response.status}; response.data=${response.data}`);
            onDismissConfirmDelete();
          }
        })
        .catch((error) => {
          notifyError(buildDeleteFailedNotification(domain));
          console.log('error onDelete: ' + error);
          onDismissConfirmDelete();
        });
    }
  };

  const dropdownItems: JSX.Element[] = [
    <DropdownItem
      key="delete"
      onClick={() => {
        domain !== undefined && OnShowConfirmDelete();
      }}
      ouiaId="ButtonDetailsDelete"
    >
      Delete
    </DropdownItem>,
  ];

  // Tabs
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const handleTabClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  // Return render
  return (
    <>
      <Page>
        <PageHeader className="pf-u-mb-0">
          <Flex>
            <FlexItem className="pf-u-mr-auto">
              <PageHeaderTitle title={domain?.title} ouiaId="TextDetailTitle" />
            </FlexItem>
            <FlexItem>
              <Dropdown
                onSelect={onKebabSelect}
                toggle={<KebabToggle onToggle={(event, isOpen) => onKebabToggle(isOpen, event)} />}
                isOpen={isKebabOpen}
                isPlain
                dropdownItems={dropdownItems}
                position="right"
                ouiaId=""
              />
            </FlexItem>
          </Flex>
          <Tabs hasNoBorderBottom activeKey={activeTabKey} onSelect={handleTabClick} isBox={false} aria-label="Tabs in the detail page" role="region">
            <Tab title={<TabTitleText>General</TabTitleText>} eventKey={0} ouiaId="ButtonDetailGeneral" />
            <Tab title={<TabTitleText>Servers</TabTitleText>} eventKey={1} ouiaId="ButtonDetailServers" />
          </Tabs>
        </PageHeader>
        <PageSection>
          <Card ouiaId="CardDetailPage">
            <CardBody>
              {activeTabKey === 0 && (
                <DetailGeneral
                  domain={domain}
                  onShowServerTab={() => {
                    setActiveTabKey(1);
                  }}
                  onChange={(value: Domain) => {
                    setDomain(value);
                    appContext?.updateDomain(value);
                  }}
                />
              )}
              {activeTabKey === 1 && <DetailServers domain={domain} />}
            </CardBody>
          </Card>
        </PageSection>
      </Page>
      <ConfirmDeleteDomain domain={domain} isOpen={isOpenConfirmDelete} onCancel={onDismissConfirmDelete} onDelete={onDelete} />
    </>
  );
};

export default DetailPage;
