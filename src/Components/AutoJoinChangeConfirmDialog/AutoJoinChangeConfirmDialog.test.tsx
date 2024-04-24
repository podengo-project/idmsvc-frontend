import React from 'react';
import { render, screen } from '@testing-library/react';
import AutoJoinChangeConfirmDialog from './AutoJoinChangeConfirmDialog';
import '@testing-library/jest-dom';
import { Domain, DomainType } from '../../Api';

const domain: Domain = {
  title: 'domain',
  description: 'description',
  auto_enrollment_enabled: true,
  domain_id: '1',
  domain_name: 'domain',
  domain_type: DomainType.RhelIdm,
};

test('expect that it does not crash with undefined domain', () => {
  // When rendered with undefined domain
  const { container } = render(<AutoJoinChangeConfirmDialog isOpen={true} />);

  // Then the dialog should not be displayed
  expect(container).toBeEmptyDOMElement();
});

test('expect empty when isOpen is false', () => {
  // When rendered with isOpen false
  const { container } = render(<AutoJoinChangeConfirmDialog domain={domain} isOpen={false} />);

  // Then the dialog should not be displayed
  expect(container).toBeEmptyDOMElement();
});

test('expect modal displayed - disable', () => {
  // Given a domain with auto_enrollment_enabled true
  expect(domain.auto_enrollment_enabled).toBe(true);

  // When rendered with isOpen true and auto_enrollment_enabled true
  render(<AutoJoinChangeConfirmDialog domain={domain} isOpen={true} />);

  // Then the disable dialog should be displayed
  expect(screen.getByRole('heading')).toHaveTextContent('Disable domain auto-join on launch');
});

test('expect modal displayed - enable', () => {
  // Given a domain with auto_enrollment_enabled false
  const domain2 = { ...domain, auto_enrollment_enabled: false };

  // When rendered with isOpen
  render(<AutoJoinChangeConfirmDialog domain={domain2} isOpen={true} />);

  // Then the enable dialog should be displayed
  expect(screen.getByRole('heading')).toHaveTextContent('Enable domain auto-join on launch');
});

test('expect handlers to be called', () => {
  // given
  const confirmHandler = jest.fn();
  const cancelHandler = jest.fn();
  render(<AutoJoinChangeConfirmDialog domain={domain} isOpen={true} onConfirm={confirmHandler} onCancel={cancelHandler} />);

  // when the OK button is clicked
  screen.getByRole('button', { name: 'OK' }).click();

  // then the confirmHandler should be called with the domain as argument and cancelHandler should not be called
  expect(confirmHandler).toBeCalledWith(domain);
  expect(cancelHandler).toBeCalledTimes(0);

  // given mocks are cleared
  confirmHandler.mockClear();
  cancelHandler.mockClear();

  // when the dialog Cancel button is clicked
  screen.getByRole('button', { name: 'Cancel' }).click();

  // then the confirmHandler should not be called and cancelHandler should be called
  expect(confirmHandler).toBeCalledTimes(0);
  expect(cancelHandler).toBeCalledTimes(1);
});
