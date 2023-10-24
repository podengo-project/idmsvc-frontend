import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Flex,
  FlexItem,
  Tab,
  Tabs,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import './DetailPage.scss';
import { Domain, ResourcesApiFactory } from '../../Api/api';
import { AppContext } from '../../AppContext';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

interface DetailHeaderProps {
  domain: Domain | undefined;
}

const DetailHeader = (props: DetailHeaderProps) => {
  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);
  const navigate = useNavigate();

  const onDeleteHandler = () => {
    // TODO Add delete handler
    navigate('/domains');
    return;
  };

  const [joinable, setJoinable] = useState(props.domain?.auto_enrollment_enabled);

  const onJoinableHandler = (value: boolean) => {
    console.log(`clicked on Enable/Disable, on ${props.domain?.domain_id}`);
    if (props.domain?.domain_id) {
      resources_api
        .updateDomainUser(props.domain?.domain_id, {
          auto_enrollment_enabled: value,
        })
        .then((response) => {
          if (response.status == 200) {
            setJoinable(value);
          } else {
            // TODO show-up notification with error message
          }
        })
        .catch((error) => {
          // TODO show-up notification with error message
          console.log('error onClose: ' + error);
        });
    }
  };

  return (
    <>
      <PageHeader>
        <Flex>
          <FlexItem className="pf-u-mr-auto">
            <PageHeaderTitle title={props.domain?.domain_name} />
            <TextContent>{props.domain?.description}</TextContent>
          </FlexItem>
          <FlexItem>
            <Button variant="secondary">Edit</Button>{' '}
            <Button variant="secondary" onClick={onDeleteHandler}>
              Delete
            </Button>{' '}
            <Button variant="secondary" isDisabled={joinable} onClick={() => onJoinableHandler(true)}>
              Enable
            </Button>{' '}
            <Button variant="secondary" isDisabled={!joinable} onClick={() => onJoinableHandler(false)}>
              Disable
            </Button>
          </FlexItem>
        </Flex>
      </PageHeader>
    </>
  );
};

interface DetailContentProps extends React.HTMLProps<HTMLDivElement> {
  domain: Domain | undefined;
}

const DetailContent = (props: DetailContentProps) => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);

  // States
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  // Events
  const handleTabClick = (event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  // Contents
  const drawerContent = (
    <>
      <TableComposable>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>UUID</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr key={props.domain?.domain_id}>
            <Td>{props.domain?.domain_name}</Td>
            <Td>Domain</Td>
            <Td>{props.domain?.domain_id}</Td>
          </Tr>
          {props.domain?.['rhel-idm']?.servers.map((server) => {
            return (
              <Tr key={server.subscription_manager_id}>
                <Th>{server.fqdn}</Th>
                <Th>Server</Th>
                <Th>{server.subscription_manager_id}</Th>
              </Tr>
            );
          })}
        </Tbody>
      </TableComposable>
    </>
  );
  const panelContent = (
    <>
      <DrawerPanelContent isResizable minSize="300px" maxSize="400px" defaultSize="400px">
        <DrawerHead>
          <TextContent>
            <Text component={TextVariants.h2}>{props.domain?.domain_name}</Text>
          </TextContent>
        </DrawerHead>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab title="General" eventKey={0}></Tab>
          <Tab title="Additional" eventKey={1}></Tab>
        </Tabs>
      </DrawerPanelContent>
    </>
  );

  return (
    <>
      <Drawer isStatic isExpanded={true}>
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody>{drawerContent}</DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

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

  // Params
  const { domain_id } = useParams();

  // States
  const [domain, setDomain] = useState<Domain>();

  console.log('INFO:DetailPage render:domain_id=' + domain_id);

  // TODO Extract in a hook
  useEffect(() => {
    if (domain_id) {
      resources_api
        .readDomain(domain_id)
        .then((res) => {
          if (res.status === 200) {
            setDomain(res.data);
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
  }, [domain_id]);

  return (
    <>
      <DetailHeader domain={domain} />
      <DetailContent domain={domain} className="pt-u-mt-xs" />
    </>
  );
};

export default DetailPage;
