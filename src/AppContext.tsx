import { ReactNode, createContext, useState } from 'react';
import { Domain } from './Api';
import { VerifyState } from './Routes/WizardPage/Components/VerifyRegistry/VerifyRegistry';
import React from 'react';

/**
 * It represents the application context so common events and properties
 * are shared for many components, making their values accessible.
 * @public
 */
export interface AppContextType {
  /** Represent the current list of domains to be displayed in the listDomains view. */
  domains: Domain[];
  /** Callback to set the value of `domains`. */
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
export const AppContext = createContext<AppContextType | undefined>(undefined);

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
  const [domains, _setDomains] = useState<Domain[]>([]);
  const [editing, _setEditing] = useState<Domain>();

  const [wizardToken, _setWizardSetToken] = useState<string>();
  const [wizardRegisteredStatus, _setWizardRegisteredStatus] = useState<VerifyState>('initial');
  const [wizardDomain, _setWizardDomain] = useState<Domain>();

  /**
   * Update a domain into the list of domains kept into the application context
   * if it exists.
   * @param domain The domain to be updated into the context.
   */
  const _updateDomain = (domain: Domain) => {
    const newDomains: Domain[] = {} as Domain[];
    for (const idx in domains) {
      if (domains[idx].domain_id === domain.domain_id) {
        newDomains[idx] = domain;
      } else {
        newDomains[idx] = domains[idx];
      }
    }
    _setDomains(newDomains);
  };

  /**
   * Delete a domain from the application context if it exists, which is
   * identified by the its id.
   * @param id the domain identifier.
   */
  const _deleteDomain = (id: string) => {
    const newDomains: Domain[] = {} as Domain[];
    for (const idx in domains) {
      if (domains[idx].domain_id !== id) {
        newDomains[idx] = domains[idx];
      }
    }
    _setDomains(newDomains);
  };

  /**
   * Retrieve a domain from the application context if it exists.
   * @param id the domain identifier.
   * @returns The domain that exists into the application context
   * or undefined if it is not found.
   */
  const _getDomain = (id: string): Domain | undefined => {
    if (id === '') return undefined;
    for (const idx in domains) {
      if (domains[idx].domain_id === id) {
        return domains[idx];
      }
    }
    return undefined;
  };

  return (
    <AppContext.Provider
      value={{
        domains: domains,
        setDomains: _setDomains,
        updateDomain: _updateDomain,
        deleteDomain: _deleteDomain,
        getDomain: _getDomain,
        editing: editing,
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
