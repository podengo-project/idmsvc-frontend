import { ActionsColumn, IAction, TableComposable, Tbody, Td, Th, ThProps, Thead, Tr } from '@patternfly/react-table';
import './DomainList.scss';
import { Fragment, useContext, useState } from 'react';
import React from 'react';

import { Domain, DomainType } from '../../Api/api';
import { Link } from 'react-router-dom';
import { AppContext, IAppContext } from '../../AppContext';

export interface IColumnType<T> {
  key: string;
  title: string;
  width?: number;
  render?: (columnd: IColumnType<T>, item: T) => void;
}

export interface DomainListProps {
  domains: Domain[];
}

export interface DomainProps {
  domain: Domain;
}

/**
 * Since OnSort specifies sorted columns by index, we need sortable values
 * for our object by column index.
 * @param domain the domain
 * @returns an array with the indexable fields for comparing.
 */
const getSortableRowValues = (domain: Domain): string[] => {
  // FIXME What is status column? where do we retrieve that value form the backend?
  const status = 'Available';
  const { domain_type } = domain;
  let { title, auto_enrollment_enabled } = domain;
  title = title || '';
  auto_enrollment_enabled = auto_enrollment_enabled || false;
  const text_auto_enrollment_enabled = auto_enrollment_enabled === true ? 'Enabled' : 'Disabled';
  return [title, domain_type, status, text_auto_enrollment_enabled];
};

type fnCompareRows = (a: Domain, b: Domain) => number;

/**
 * Create an arrow function to compare rows when sorting the table
 * content for the list of domains.
 * @param activeSortIndex the index for the sorting column.
 * @param activeSortDirection the direction for sorting the rows.
 * @returns a lambda function that sort data by the selected criteria.
 */
function createCompareRows(activeSortIndex: number, activeSortDirection: 'asc' | 'desc' | undefined): fnCompareRows {
  return (a: Domain, b: Domain) => {
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

const DomainListFieldType: React.FC<{ domain_type: DomainType }> = (props) => {
  switch (props.domain_type) {
    case 'rhel-idm':
      return <>RHEL IdM</>;
    default:
      return <>{props.domain_type}: Not supported</>;
  }
};

const DomainListFieldStatus: React.FC<{ domain: Domain }> = (props) => {
  // TODO TBD Which values to return and logic for them
  if (props.domain.domain_id === undefined || props.domain.domain_id === null) {
    return <>Unavailable</>;
  } else {
    return <>Available</>;
  }
};

export const DomainList: React.FC = () => {
  const context = useContext<IAppContext>(AppContext);

  // Index of the currently sorted column
  // Note: if you intend to make columns reorderable, you may instead want to use a non-numeric key
  // as the identifier of the sorted column. See the "Compound expandable" example.
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>(-1);

  // Sort direction of the currently sorted column
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const [domains] = useState<Domain[]>(context.domains);
  const enabledText = 'Enabled';
  const disabledText = 'Disabled';

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

  const defaultActions = (domain: Domain): IAction[] => [
    {
      title: 'Enable/Disable',
      onClick: () => console.log(`clicked on Enable/Disable, on row ${domain.title}`),
    },
    {
      title: 'Edit',
      onClick: () => console.log(`clicked on Edit, on row ${domain.title}`),
    },
    {
      title: 'Delete',
      onClick: () => console.log(`clicked on Delete, on row ${domain.title}`),
    },
  ];

  // Note that we perform the sort as part of the component's render logic and not in onSort.
  // We shouldn't store the list of data in state because we don't want to have to sync that with props.
  activeSortIndex !== null && domains.sort(createCompareRows(activeSortIndex, activeSortDirection));

  return (
    <>
      <TableComposable>
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)}>Name</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th sort={getSortParams(3)}>Host domain join on launch</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {domains.map((domain) => {
            const rowActions: IAction[] | null = defaultActions(domain);
            if (domain.auto_enrollment_enabled === true) {
              rowActions[0].title = 'Disable';
            } else {
              rowActions[0].title = 'Enable';
            }
            return (
              <>
                <Tr key={domain.domain_id}>
                  <Td>
                    <Link to="/domains/{domain.domain_id}">{domain.title}</Link>
                  </Td>
                  <Td>
                    <DomainListFieldType domain_type={domain.domain_type} />
                  </Td>
                  <Td>
                    <DomainListFieldStatus domain={domain} />
                  </Td>
                  <Td>{domain.auto_enrollment_enabled ? enabledText : disabledText}</Td>
                  <Td isActionCell>
                    <ActionsColumn items={rowActions} />
                  </Td>
                </Tr>
              </>
            );
          })}
        </Tbody>
      </TableComposable>
    </>
  );
};

export default DomainList;
