import { ActionsColumn, IAction, TableComposable, Tbody, Td, Th, ThProps, Thead, Tr } from '@patternfly/react-table';
import './DomainList.scss';
import { Fragment, useContext, useState } from 'react';
import React from 'react';

import { Domain, DomainType, ResourcesApiFactory } from '../../Api/api';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext, IAppContext } from '../../AppContext';
import { Button } from '@patternfly/react-core';

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
  const { domain_type } = domain;
  let { title, auto_enrollment_enabled } = domain;
  title = title || '';
  auto_enrollment_enabled = auto_enrollment_enabled || false;
  const text_auto_enrollment_enabled = auto_enrollment_enabled === true ? 'Enabled' : 'Disabled';
  return [title, domain_type, text_auto_enrollment_enabled];
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

interface DomainListFieldTypeProps {
  domain_type: DomainType;
}

const DomainListFieldType = (props: DomainListFieldTypeProps) => {
  switch (props.domain_type) {
    case 'rhel-idm':
      return <>Red Hat IdM</>;
    default:
      return <>{props.domain_type}: Not supported</>;
  }
};

export const DomainList = () => {
  const base_url = '/api/idmsvc/v1';
  const resources_api = ResourcesApiFactory(undefined, base_url, undefined);

  const context = useContext<IAppContext>(AppContext);
  const navigate = useNavigate();

  // Index of the currently sorted column
  // Note: if you intend to make columns reorderable, you may instead want to use a non-numeric key
  // as the identifier of the sorted column. See the "Compound expandable" example.
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>(-1);

  // Sort direction of the currently sorted column
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const [domains, setDomains] = useState<Domain[]>(context.getDomains());
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

  // given a domain object, replace it in the `domains` state
  // (matching by uuid).
  const replaceDomain = (newDomain: Domain): void => {
    const newDomains = domains.map((domain) => {
      return domain.domain_id === newDomain.domain_id ? newDomain : domain;
    });
    setDomains(newDomains);
  };

  // remove domain(s) matching the given uuid from the `domains` state
  const removeDomain = (uuid: string): void => {
    const newDomains: Domain[] = [];
    for (const domain of domains) {
      if (domain.domain_id !== uuid) {
        newDomains.push(domain);
      }
    }
    setDomains(newDomains);
  };

  const onEnableDisable = (domain: Domain) => {
    console.log(`clicked on Enable/Disable, on row ${domain.title}`);
    if (domain.domain_id) {
      resources_api
        .updateDomainUser(domain.domain_id, {
          auto_enrollment_enabled: !domain.auto_enrollment_enabled,
        })
        .then((response) => {
          if (response.status == 200) {
            replaceDomain(response.data);
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

  const onDelete = (domain: Domain) => {
    if (domain.domain_id !== undefined) {
      const domainId = domain.domain_id;
      resources_api
        .deleteDomain(domainId)
        .then((response) => {
          if (response.status == 204) {
            removeDomain(domainId);
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

  const defaultActions = (domain: Domain): IAction[] => [
    {
      title: 'Enable/Disable',
      onClick: () => onEnableDisable(domain),
    },
    {
      title: 'Edit',
      onClick: () => console.log(`clicked on Edit, on row ${domain.title}`),
    },
    {
      title: 'Delete',
      onClick: () => onDelete(domain),
    },
  ];

  // Note that we perform the sort as part of the component's render logic and not in onSort.
  // We shouldn't store the list of data in state because we don't want to have to sync that with props.
  activeSortIndex !== null && domains.sort(createCompareRows(activeSortIndex, activeSortDirection));

  const onShowDetails = (domain: Domain | undefined) => {
    if (domain !== undefined) {
      context.setEditing(domain);
      navigate('/details/' + domain?.domain_id);
    }
  };

  return (
    <>
      <TableComposable>
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)}>Name</Th>
            <Th>Type</Th>
            <Th sort={getSortParams(3)}>Domain auto-join on launch</Th>
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
                    <Button
                      variant="link"
                      onClick={() => {
                        onShowDetails(domain);
                      }}
                    >
                      {domain.title}
                    </Button>
                  </Td>
                  <Td>
                    <DomainListFieldType domain_type={domain.domain_type} />
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
