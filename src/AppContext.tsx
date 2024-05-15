import { ReactNode, createContext, useState } from 'react';
import { Domain } from './Api/idmsvc';
import { VerifyState } from './Routes/WizardPage/Components/VerifyRegistry/VerifyRegistry';
import React from 'react';

/**
 * It represents the application context so common events and properties
 * are shared for many components, making their values accessible.
 * @public
 */
export interface AppContextType {
  /** The current list of domains to be displayed in the listDomains view. */
  listDomains: Domain[];
  /** Set the value of the list of domains. */
  setListDomains: (domains: Domain[]) => void;
  /** The total number of domains. */
  totalDomains: number;
  /** Set the value of the total number of domains. */
  setTotalDomains: (value: number) => void;
  /** Loaded full domains */
  domains: Domain[];
  /** Set the value of `domains`. */
  setDomains: (domains: Domain[]) => void;
  /** Update an existing domain in domains */
  updateDomain: (domain: Domain) => void;
  /** Delete the domain identified by id */
  deleteDomain: (id: string) => void;
  /** Get the domain identified by id */
  getDomain: (id: string) => Domain | undefined;
  /** The current editing domain */
  editing?: Domain;
  /** Set the current editing domain */
  setEditing: (value?: Domain) => void;

  /** Encapsulates the context related with the wizard. */
  wizard: {
    /** Retrieve the current token, required to register a domain. */
    token: string;
    /** Set the value of the token. */
    setToken: (value: string) => void;

    /** Retrieve the value of the registered status which is updated once
     * the user has registered the domain by using ipa-hcc tool. */
    registeredStatus: VerifyState;
    /** Setter for the registered status. */
    setRegisteredStatus: (value: VerifyState) => void;

    /** Get the ephemeral domain state that manage the wizard. */
    domain: Domain;
    /** Set the ephemeral domain information. */
    setDomain: (value: Domain) => void;
  };
}

/**
 * Represent the application context.
 * @public
 */
export const AppContext = createContext<AppContextType>({
  listDomains: [],
  setListDomains: () => undefined,
  totalDomains: 0,
  setTotalDomains: () => undefined,
  domains: [],
  setDomains: () => undefined,
  updateDomain: () => undefined,
  deleteDomain: () => undefined,
  getDomain: () => undefined,
  editing: undefined,
  setEditing: () => undefined,
  wizard: {
    token: '',
    setToken: () => undefined,
    registeredStatus: 'initial',
    setRegisteredStatus: () => undefined,
    domain: {} as Domain,
    setDomain: () => undefined,
  },
});

/**
 * The properties accepted by the AppContextProvider.
 */
interface AppContextProviderProps {
  /** The children components. */
  children: ReactNode;
}

/**
 * Define the provider for the application context.
 * @param param0 The children components.
 * @returns the application context.
 */
export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [listDomains, setListDomains] = useState<Domain[]>([]);
  const [totalDomains, setTotalDomains] = useState<number>(0);

  const [domains, setDomains] = useState<Domain[]>([]);
  const [editing, _setEditing] = useState<Domain>();

  const [wizardToken, _setWizardSetToken] = useState<string>();
  const [wizardRegisteredStatus, _setWizardRegisteredStatus] = useState<VerifyState>('initial');
  const [wizardDomain, _setWizardDomain] = useState<Domain>();

  /**
   * Update a domain into the list of domains kept into the application context
   * if it exists.
   * @param domain The domain to be updated into the context.
   */
  const _updateDomain = (domains: Domain[], domain: Domain, add: boolean) => {
    let set = false;
    const newDomains: Domain[] = domains.map((item) => {
      if (item.domain_id === domain.domain_id) {
        set = true;
        return domain;
      } else {
        return item;
      }
    });
    if (!set && add) {
      newDomains.push(domain);
    }
    return newDomains;
  };

  const updateDomain = (domain: Domain) => {
    setDomains(_updateDomain(domains, domain, true));
    setListDomains(_updateDomain(listDomains, domain, false));
  };

  const _deleteDomain = (domains: Domain[], id: string) => {
    const newDomains: Domain[] = domains.filter((domain) => domain.domain_id !== id);
    return newDomains;
  };

  /**
   * Delete a domain from the application context if it exists, which is
   * identified by the its id.
   * @param id the domain identifier.
   */
  const deleteDomain = (id: string) => {
    setDomains(_deleteDomain(domains, id));
    setListDomains(_deleteDomain(listDomains, id));
    if (totalDomains > 0) {
      setTotalDomains(totalDomains - 1);
    }
  };

  /**
   * Retrieve a domain from the application context if it exists.
   * @param id the domain identifier.
   * @returns The domain that exists into the application context
   * or undefined if it is not found.
   */
  const _getDomain = (id: string): Domain | undefined => {
    if (!id) return undefined;
    return domains.find((domain) => domain.domain_id === id);
  };

  return (
    <AppContext.Provider
      value={{
        listDomains,
        setListDomains,
        totalDomains,
        setTotalDomains,
        domains,
        setDomains,
        updateDomain,
        deleteDomain,
        getDomain: _getDomain,
        editing,
        setEditing: _setEditing,
        wizard: {
          token: wizardToken || '',
          setToken: _setWizardSetToken,
          registeredStatus: wizardRegisteredStatus,
          setRegisteredStatus: _setWizardRegisteredStatus,
          domain: wizardDomain || ({} as Domain),
          setDomain: _setWizardDomain,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
