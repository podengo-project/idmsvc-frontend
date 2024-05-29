import React from 'react';
import { render } from '@testing-library/react';
import CenteredSpinner from './CenteredSpinner';
import '@testing-library/jest-dom';

test('expect CenteredSpinner to render', () => {
  render(<CenteredSpinner />);
});
