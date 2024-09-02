import React from 'react';
import { render } from '@testing-library/react';
import NoPermissions from './NoPermissions';
import '@testing-library/jest-dom';

test('expect NoPermissions to render', () => {
  const { container } = render(<NoPermissions />);
  expect(container).toHaveTextContent('Access permissions needed');
});
