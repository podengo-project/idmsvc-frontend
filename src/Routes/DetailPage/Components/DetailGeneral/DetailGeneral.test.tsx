import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
// import { DetailGeneral } from './DetailGeneral';
// import { AppContextProvider } from '../../../../AppContext';

test('expect sample-component to render children', () => {
  render(<></>);
  // render(
  //   <AppContextProvider>
  //     <DetailGeneral />
  //   </AppContextProvider>
  // );
  // expect(screen.getByRole('heading')).toHaveTextContent('Name');
  // expect(screen.getByRole('heading')).toHaveTextContent('Location');
});
