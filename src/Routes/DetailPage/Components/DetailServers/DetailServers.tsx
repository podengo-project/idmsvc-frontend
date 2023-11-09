import { Flex, FlexItem, Stack, StackItem, TextInputGroupUtilities } from '@patternfly/react-core';
import React from 'react';
import { Domain, DomainIpaServer } from '../../../../Api';
import { TableComposable, Tbody, Th, ThProps, Thead, Tr } from '@patternfly/react-table';

interface DetailServersProps {
  domain?: Domain;
}

/**
 * Since OnSort specifies sorted columns by index, we need sortable values
 * for our object by column index.
 * @param server the domain
 * @returns an array with the indexable fields for comparing.
 */
const getSortableRowValues = (server: DomainIpaServer): string[] => {
  const { fqdn, location, hcc_enrollment_server } = server;
  const hcc_enrollment_server_label = hcc_enrollment_server === true ? 'Yes' : 'No';
  return [fqdn, location || '', hcc_enrollment_server_label];
};

type fnCompareRows = (a: DomainIpaServer, b: DomainIpaServer) => number;

/**
 * Create an arrow function to compare rows when sorting the table
 * content for the list of domains.
 * @param activeSortIndex the index for the sorting column.
 * @param activeSortDirection the direction for sorting the rows.
 * @returns a lambda function that sort data by the selected criteria.
 */
function createCompareRows(activeSortIndex: number, activeSortDirection: 'asc' | 'desc' | undefined): fnCompareRows {
  return (a: DomainIpaServer, b: DomainIpaServer) => {
    const aValue = getSortableRowValues(a)[activeSortIndex];
    const bValue = getSortableRowValues(b)[activeSortIndex];
    if (aValue === bValue) {
      return 0;
    }
    if (typeof aValue === 'undefined') {
      if (activeSortDirection === 'asc') {
        return -1;
      }
      return +1;
    }
    if (typeof bValue === 'undefined') {
      if (activeSortDirection === 'asc') {
        return +1;
      }
      return -1;
    }

    if (typeof aValue === 'string') {
      // String sort
      if (activeSortDirection === 'asc') {
        return (aValue as string).localeCompare(bValue as string);
      }
      return (bValue as string).localeCompare(aValue as string);
    }
    return 0;
  };
}

export const DetailServers = (props: DetailServersProps) => {
  // const context = useContext(AppContext);
  const domain = props.domain;
  if (domain === undefined) {
    return <></>;
  }

  const servers = domain['rhel-idm']?.servers;
  if (servers === undefined) {
    return <></>;
  }

  // Index of the currently sorted column
  // Note: if you intend to make columns reorderable, you may instead want to use a non-numeric key
  // as the identifier of the sorted column. See the "Compound expandable" example.
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>(-1);
  // Sort direction of the currently sorted column
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc', // starting sort direction when first sorting a column. Defaults to 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  // Note that we perform the sort as part of the component's render logic and not in onSort.
  // We shouldn't store the list of data in state because we don't want to have to sync that with props.
  activeSortIndex !== null && servers.sort(createCompareRows(activeSortIndex, activeSortDirection));

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
                <Th sort={getSortParams(0)}>Name</Th>
                <Th sort={getSortParams(1)}>Location</Th>
                <Th sort={getSortParams(2)}>HCC Enrollment</Th>
              </Tr>
            </Thead>
            <Tbody>
              {servers.map((server) => (
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
