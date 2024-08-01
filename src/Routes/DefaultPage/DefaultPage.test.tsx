import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResourcesApiFactory } from '../../Api/idmsvc';
import DefaultPage from './DefaultPage';
import { AppContextProvider } from '../../AppContext';

jest.mock('../../Api/idmsvc', () => {
  const original = jest.requireActual('../../Api/idmsvc');
  return {
    __esModule: true,
    ...original,
    ResourcesApiFactory: jest.fn(),
  };
});

jest.mock('../../Hooks/useIdmPermissions', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    isLoading: false,
    permissions: {
      hasTokenCreate: true,
      hasDomainsRead: true,
      hasDomainsList: true,
      hasDomainsUpdate: true,
      hasDomainsDelete: true,
    },
  }),
}));

jest.mock('../../Hooks/useNotification', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    notify: jest.fn(),
    notifyError: jest.fn(),
    notifySuccess: jest.fn(),
    notifyWarning: jest.fn(),
    removeNotification: jest.fn(),
  }),
}));

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getListDomainsMock(domains: any) {
  return jest.fn().mockResolvedValue({
    data: {
      data: domains,
      links: {
        first: '/api/idmsvc/v1/domains?limit=10&offset=0',
        last: '/api/idmsvc/v1/domains?limit=10&offset=0',
      },
      meta: {
        count: domains.length,
        limit: 10,
        offset: 0,
      },
    },
  });
}

describe('DefaultPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the MultipleEnabledDomainsWarning component when there are multiple enabled domains', async () => {
    // Given
    const mockDomains = [
      {
        auto_enrollment_enabled: true,
        description: '',
        domain_id: 'aba1ea83-b88e-522f-93a0-422f423531bb',
        domain_name: 'mydomain.example',
        domain_type: 'rhel-idm',
        title: 'mydomain.example',
      },
      {
        auto_enrollment_enabled: true,
        description: '',
        domain_id: 'aba1ea83-b88e-522f-93a0-422f423531cc',
        domain_name: 'myotherdomain.example',
        domain_type: 'rhel-idm',
        title: 'myotherdomain.example',
      },
    ];

    (ResourcesApiFactory as jest.Mock).mockReturnValueOnce({
      listDomains: getListDomainsMock(mockDomains),
    });

    // When
    render(
      <AppContextProvider>
        <DefaultPage />
      </AppContextProvider>
    );
    await screen.findByTestId('ListContent');

    // Then
    expect(screen.getByTestId('MultipleEnabledDomainsWarning')).toBeInTheDocument();
  });

  it('does not render the MultipleEnabledDomainsWarning component when there is only one enabled domain', async () => {
    // Given
    const mockDomains = [
      {
        auto_enrollment_enabled: true,
        description: '',
        domain_id: 'aba1ea83-b88e-522f-93a0-422f423531bb',
        domain_name: 'mydomain.example',
        domain_type: 'rhel-idm',
        title: 'mydomain.example',
      },
      {
        auto_enrollment_enabled: false,
        description: '',
        domain_id: 'aba1ea83-b88e-522f-93a0-422f423531cc',
        domain_name: 'myotherdomain.example',
        domain_type: 'rhel-idm',
        title: 'myotherdomain.example',
      },
    ];

    (ResourcesApiFactory as jest.Mock).mockReturnValueOnce({
      listDomains: getListDomainsMock(mockDomains),
    });

    // When
    render(
      <AppContextProvider>
        <DefaultPage />
      </AppContextProvider>
    );
    await screen.findByTestId('ListContent');

    // Then
    expect(screen.queryByTestId('MultipleEnabledDomainsWarning')).toBeNull();
  });
});
