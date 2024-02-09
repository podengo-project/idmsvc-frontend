import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import {
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  Flex,
  FlexItem,
  KebabToggle,
  Page,
  PageSection,
  Tab,
  TabTitleText,
  Tabs,
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import './DetailPage.scss';
import { Domain, ResourcesApiFactory } from '../../Api/api';
import { AppContext, AppContextType } from '../../AppContext';
import { DetailGeneral } from './Components/DetailGeneral/DetailGeneral';
import { DetailServers } from './Components/DetailServers/DetailServers';

/**
 * It represents the detail page to show the information about a
 * registered domain.
 * @see https://stackoverflow.com/questions/75522048/react-how-to-access-urls-parameters
 * @see https://reactrouter.com/en/main/hooks/use-params
 */
const DetailPage = () => {
  const appContext = useContext<AppContextType | undefined>(AppContext);
  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);
  const navigate = useNavigate();

  // Params
  const { domain_id } = useParams();

  // States
  const [domain, setDomain] = useState<Domain | undefined>(appContext?.getDomain(domain_id || ''));

  console.log('INFO:DetailPage render:domain_id=' + domain_id);

  // TODO encapsulate in a custom hook to reuse
  // Load Domain resource
  useEffect(() => {
    if (domain_id !== undefined && domain === undefined) {
      resources_api
        .readDomain(domain_id)
        .then((res) => {
          if (res.status === 200) {
            console.info('res.data=' + res.data);
            setDomain(res.data as Domain);
          }
        })
        .catch((reason) => {
          // TODO Send error notification to chrome
          console.log(reason);
        });
    }

    return () => {
      // Finalizer
    };
  }, []);

  // Kebab menu
  const [isKebabOpen, setIsKebabOpen] = useState<boolean>(false);

  const onKebabToggle = (
    isOpen: boolean,
    event: MouseEvent | TouchEvent | KeyboardEvent | React.KeyboardEvent<any> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setIsKebabOpen(isOpen);
  };

  const onKebabSelect = (event?: React.SyntheticEvent<HTMLDivElement>): void => {
    event?.stopPropagation();
    setIsKebabOpen(!isKebabOpen);
  };

  const dropdownItems: JSX.Element[] = [
    <DropdownItem
      key="delete"
      onClick={(value) => {
        console.log('Deleting domain: ' + value);
        if (domain_id !== undefined) {
          resources_api
            .deleteDomain(domain_id)
            .then((res) => {
              if (res.status === 204) {
                console.info('Domain ' + value + ' was deleted');
                appContext?.deleteDomain(domain_id);
                navigate('/domains', { replace: true });
              }
            })
            .catch((reason) => {
              // TODO Send error notification to chrome
              console.log(reason);
            });
        }
      }}
      ouiaId="ButtonDetailsDelete"
    >
      Delete
    </DropdownItem>,
  ];

  // Tabs
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const handleTabClick = (event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
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
                toggle={<KebabToggle onToggle={onKebabToggle} />}
                isOpen={isKebabOpen}
                isPlain
                dropdownItems={dropdownItems}
                position="right"
                ouiaId=""
              />
            </FlexItem>
          </Flex>
          <Tabs
            hasBorderBottom={false}
            activeKey={activeTabKey}
            onSelect={handleTabClick}
            isBox={false}
            aria-label="Tabs in the detail page"
            role="region"
          >
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
    </>
  );
};

export default DetailPage;
