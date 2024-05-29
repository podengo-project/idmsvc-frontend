import { Bullseye, Spinner } from '@patternfly/react-core';
import React from 'react';

/**
 * Component to show a Spineer centered in the available fragment
 * of the screen.
 */
const CenteredSpinner = () => {
  return (
    <Bullseye>
      <Spinner />
    </Bullseye>
  );
};

export default CenteredSpinner;
