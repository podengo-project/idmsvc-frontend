import React from 'react';
import { render, screen } from '@testing-library/react';
import ConfirmDeleteDomain from './ConfirmDeleteDomain';
import '@testing-library/jest-dom';
import { Domain } from '../../Api/idmsvc';

const domain: Domain = {
  domain_name: 'mydomain.test',
} as unknown as Domain;

test('expect empty when isOpen is false', () => {
  const root = render(<ConfirmDeleteDomain domain={domain} isOpen={false} />);
  expect(root.container).toBeEmptyDOMElement();
});

test('expect modal displayed', () => {
  render(<ConfirmDeleteDomain domain={domain} isOpen={true} />);
  expect(screen.getByRole('heading')).toHaveTextContent(/^Warning alert:Delete identity domain registration\?$/);
  expect(screen.getByRole('button', { name: 'Close' })).toHaveTextContent(/^$/);
  expect(screen.getByRole('button', { name: 'Delete' })).toHaveTextContent(/^Delete$/);
  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveTextContent(/^Cancel$/);
});

test('expect handler onDelete to be called', () => {
  // given
  const confirmHandler = jest.fn();
  const cancelHandler = jest.fn();
  render(<ConfirmDeleteDomain domain={domain} isOpen={true} onDelete={confirmHandler} onCancel={cancelHandler} />);

  // when the OK button is clicked
  screen.getByRole('button', { name: 'Delete' }).click();

  // then the confirmHandler should be called with the domain as argument and cancelHandler should not
  expect(confirmHandler).toBeCalledWith(domain);
  expect(cancelHandler).toBeCalledTimes(0);
});

test('expect handler onCancel to be called', () => {
  // given
  const confirmHandler = jest.fn();
  const cancelHandler = jest.fn();
  render(<ConfirmDeleteDomain domain={domain} isOpen={true} onDelete={confirmHandler} onCancel={cancelHandler} />);

  // when the OK button is clicked
  screen.getByRole('button', { name: 'Cancel' }).click();

  // then the confirmHandler should be called with the domain as argument and cancelHandler should not
  expect(cancelHandler).toBeCalledTimes(1);
  expect(confirmHandler).toBeCalledTimes(0);
});
