import React from 'react';
import { render } from '@testing-library/react';
import NoPermissions from './NoPermissions';
import '@testing-library/jest-dom';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    isBeta: () => true,
  });
});

test('expect NoPermissions to render', () => {
  const { container } = render(<NoPermissions />);
  expect(container).toHaveTextContent('Access permissions needed');
});
