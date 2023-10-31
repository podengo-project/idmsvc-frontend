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

  return (
    <AppContext.Provider
      value={{
        domains: domains,
        setDomains: _setDomains,
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
