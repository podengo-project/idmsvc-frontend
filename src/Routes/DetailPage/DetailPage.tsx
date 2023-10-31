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

interface DetailContentProps extends React.HTMLProps<HTMLDivElement> {
  domain: Domain | undefined;
}

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
  const [domain, setDomain] = useState<Domain>();
  const domains = appContext?.domains;

  console.log('INFO:DetailPage render:domain_id=' + domain_id);

  const setTitle = (value: string) => {
    domain !== undefined && setDomain({ ...domain, title: value });
  };

  const setAutoEnrollment = (value: boolean) => {
    domain !== undefined && setDomain({ ...domain, auto_enrollment_enabled: value });
  };

  // Load Domain resource
  useEffect(() => {
    if (domain_id !== undefined) {
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

  // useEffect(() => {
  //   if (domain !== undefined && domain.title !== undefined) {
  //     setTitle(domain.title);
  //   }
  // }, [domain?.title]);

  // const replaceDomain = (newDomain: Domain): void => {
  //   const newDomains = domains.map((domain) => {
  //     return domain.domain_id === newDomain.domain_id ? newDomain : domain;
  //   });
  //   appContext.setDomains(newDomains);
  // };

  // const onJoinableHandler = (value: boolean) => {
  //   console.log(`clicked on Enable/Disable, on ${domain?.domain_id}`);
  //   if (domain?.domain_id) {
  //     resources_api
  //       .updateDomainUser(domain?.domain_id, {
  //         auto_enrollment_enabled: value,
  //       })
  //       .then((response) => {
  //         if (response.status == 200) {
  //           setAutoEnrollment(value);
  //         } else {
  //           // TODO show-up notification with error message
  //         }
  //       })
  //       .catch((error) => {
  //         // TODO show-up notification with error message
  //         console.log('error onClose: ' + error);
  //       });
  //   }
  // };

  // const onDeleteHandler = (/* event: MouseEvent<HTMLButtonElement, MouseEvent> */): void => {
  //   throw new Error('Function not implemented.');
  // };

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

  const dropdownItems: JSX.Element[] = [<DropdownItem key="delete">Delete</DropdownItem>];

  // Tabs
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isBox, setIsBox] = React.useState<boolean>(false);
  const handleTabClick = (event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  const toggleBox = (checked: boolean) => {
    setIsBox(checked);
  };

  // Return render
  return (
    <>
      <Page>
        <PageHeader className="pf-u-mb-0">
          <Flex>
            <FlexItem className="pf-u-mr-auto">
              <PageHeaderTitle title={domain?.title} />
            </FlexItem>
            <FlexItem>
              <Dropdown
                onSelect={onKebabSelect}
                toggle={<KebabToggle onToggle={onKebabToggle} />}
                isOpen={isKebabOpen}
                isPlain
                dropdownItems={dropdownItems}
                position="right"
              />
            </FlexItem>
          </Flex>
          <Tabs
            hasBorderBottom={false}
            activeKey={activeTabKey}
            onSelect={handleTabClick}
            isBox={isBox}
            aria-label="Tabs in the detail page"
            role="region"
          >
            <Tab title={<TabTitleText>General</TabTitleText>} eventKey={0} />
            <Tab title={<TabTitleText>Servers</TabTitleText>} eventKey={1} />
          </Tabs>
        </PageHeader>
        <PageSection>
          <Card>
            <CardBody>
              {activeTabKey === 0 && (
                <DetailGeneral
                  domain={domain}
                  onShowServerTab={() => {
                    setActiveTabKey(1);
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
