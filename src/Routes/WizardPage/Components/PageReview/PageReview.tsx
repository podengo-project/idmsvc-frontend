/**
 * This library encapsulate the PageReview page for the wizard
 * component.
 *
 * @example
 * Basic usage
 * ```
 * <PageReview domain={my_domain} />
 * ```
 *
 * @packageDocumentation
 */
import React from 'react';

import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Title } from '@patternfly/react-core';

import './PageReview.scss';
import { Domain, DomainIpaServer } from '../../../../Api/api';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

/**
 * Encapsulate the table header for the list of
 * rhel-idm ipa servers.
 * @returns Return the table header render.
 * @see {@link PageReviewIpaServers} about the parent component.
 */
const PageReviewIpaServersHead = () => {
  return (
    <Thead>
      <Tr>
        <Th>Name</Th>
        <Th>UUID</Th>
      </Tr>
    </Thead>
  );
};

/**
 * Represents the propoerties for PageReviewIpaServersBody.
 */
interface PageReviewIpaServersProps {
  /** The list of ipa servers associated to the rhel-idm. */
  servers?: DomainIpaServer[];
}

/**
 * Represents the body which shows the IPA server list.
 * @param props Contains the list of servers at `servers`.
 * @returns the body for the list of servers to use in the
 * `TableComposable` component.
 * @see {@link PageReviewIpaServersProps} about the properties.
 * @see {@link PageReviewIpa} about the parent component.
 */
const PageReviewIpaServersBody = (props: PageReviewIpaServersProps) => {
  return (
    <Tbody>
      {props.servers?.map((server) => {
        return (
          <Tr key={server.subscription_manager_id}>
            <Td>{server.fqdn}</Td>
            <Td>{server.subscription_manager_id}</Td>
          </Tr>
        );
      })}
    </Tbody>
  );
};

/**
 * Represent the table which list the IPA servers.
 * @param props has the `servers` property which contains the
 * list of servers that belongs to this rhel-idm domain.
 * @returns the composable table with the header and body.
 * @see {@link PageReviewIpaServersProps} about the properties.
 * @see {@link PageReviewIpa} about the parent component.
 */
const PageReviewIpaServers = (props: PageReviewIpaServersProps) => {
  return (
    <>
      <TableComposable variant="compact">
        <PageReviewIpaServersHead />
        <PageReviewIpaServersBody servers={props.servers} />
      </TableComposable>
    </>
  );
};

/**
 * This component represent the overview information to be
 * presented for an rhel-idm domain service.
 * @param props the `domain` property expect a 'rhel-idm' type.
 * @returns the overview details for a rhel-idm domain service.
 * @see {@link PageReviewProps} about the properties.
 * @see {@link PageReview} about the parent component.
 */
const PageReviewIpa = (props: PageReviewProps & { className?: string }) => {
  const auto_enrollment_description: string = props.domain.auto_enrollment_enabled
    ? 'Enable upon finishing registration'
    : 'Not enable upon finishing registration';
  return (
    <>
      <DescriptionList
        className={props.className}
        isHorizontal
        horizontalTermWidthModifier={{
          default: '12ch',
          sm: '15ch',
          md: '18ch',
          lg: '18ch',
          xl: '18ch',
          '2xl': '18ch',
        }}
      >
        <DescriptionListGroup>
          <DescriptionListTerm>Identity domain type</DescriptionListTerm>
          <DescriptionListDescription disabled>Red Hat IdM</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Kerberos realm</DescriptionListTerm>
          <DescriptionListDescription disabled>{props.domain['rhel-idm']?.realm_name}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Red Hat IdM servers</DescriptionListTerm>
          <DescriptionListDescription disabled>
            <PageReviewIpaServers servers={props.domain['rhel-idm']?.servers} />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Identity domain name</DescriptionListTerm>
          <DescriptionListDescription disabled>{props.domain.title}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Identity domain description</DescriptionListTerm>
          <DescriptionListDescription disabled>{props.domain.description}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Domain auto-join on launch</DescriptionListTerm>
          <DescriptionListDescription disabled>{auto_enrollment_description}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </>
  );
};

/**
 * Represent the properties for the PageReview component.
 */
interface PageReviewProps {
  /** The ephemeral domain information, including the detailed
   * information that the user have control about. */
  domain: Domain;
}

/**
 * It represents the Page review wizard, and it provide different view
 * depending on the domain_type value.
 * @param props provide the `domain` value to be rendered.
 * @returns the render view for the domain overview.
 * @see {@link PageReviewProps} to know about the properties.
 * @see {@link WizardPage} about the parent component.
 * @public
 */
const PageReview = (props: PageReviewProps) => {
  return (
    <>
      <Title className="pt-u-mb-xl" headingLevel={'h2'}>
        Review
      </Title>
      {props.domain.domain_type === 'rhel-idm' && <PageReviewIpa domain={props.domain} className="pf-u-mt-lg" />}
    </>
  );
};

export default PageReview;
