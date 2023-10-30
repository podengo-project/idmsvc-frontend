import { Flex, FlexItem, Stack, StackItem, TextInputGroupUtilities } from '@patternfly/react-core';
import React from 'react';
import { Domain } from '../../../../Api';
import { TableComposable, Tbody, Th, Thead, Tr } from '@patternfly/react-table';

interface DetailServersProps {
  domain?: Domain;
}

export const DetailServers = (props: DetailServersProps) => {
  // const context = useContext(AppContext);
  const domain = props.domain;
  if (domain === undefined) {
    return <></>;
  }

  // FIXME Is subscription_manager_id unique?
  return (
    <>
      <Stack>
        <StackItem>
          <Flex>
            <FlexItem>
              <TextInputGroupUtilities></TextInputGroupUtilities>
            </FlexItem>
          </Flex>
        </StackItem>
        <StackItem>
          <TableComposable aria-label="Simple table" variant="compact" borders={true} className="pt-u-width-100">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Location</Th>
                <Th>HCC Enrollment</Th>
              </Tr>
            </Thead>
            <Tbody>
              {domain['rhel-idm']?.servers.map((server) => (
                <Tr key={server.subscription_manager_id}>
                  <Th>{server.fqdn}</Th>
                  <Th>{server.location}</Th>
                  <Th>{server.hcc_enrollment_server ? 'Yes' : 'No'}</Th>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </StackItem>
      </Stack>
    </>
  );
};
