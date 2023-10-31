# Using contexts

During developing the list of domains page, a couple of situations justified the
creation of a context for the micro-frontend.

- Avoid property drilling by passing list of domains through every component
  towards the ListDomains.
- Provide the same data information for the different impacted objects.

> Avoid to use context if it evoke a performance because an excess of the
> render on the frontend.

## Defining the context

For using a context, we need to define the context (in this case it is defined
at `src/AppContext.tsx`, but we could define a context in a deeper component if
it were required).

```typescript
import { createContext } from 'react';
import { Domain } from './Api';

export interface AppContextType {
  domains: Domain[];
  setDomains: (domains: Domain[]) => void;
}

export const AppContext = createContext<AppContextType>(undefined);

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [getter, setter] = useState<T>(undefined);

  return (
    <AppContext.Provider
      value={{
        /** Map the interface to the getter and setter of this component for instance:
         *   domains: getter,
         *   setDomains: setter,
        */
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
```

Let's see what we have here:

- `AppContextType` define an interface with properties to be shared and some
  callbacks to update the properties above.
- Create the context for the type `AppContextType`.
- Define the `AppContextProvider` which map getter and setter, and extend with
  the `children`.

## Wrap your application by the context provider

```typescript
import React from 'react';

// ...

const AppEntry = () => {
  return (
    <Provider store={init(...(process.env.NODE_ENV !== 'production' ? [logger] : [])).getStore()}>
      <Router basename={getBaseName(window.location.pathname)}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Router>
    </Provider>
  );
};
```

Now we only reference the `AppContextProvider` wrapping our application. The
setter and getter are configured inside the AppContextProvider, which provide
a cleaner code.

## Use the context form other inner components

Using the context from any component nested in our App would be kind of the below:

```typescript
// we get the reference to the context
const appContext = useContext<AppContextType | undefined>(AppContext);

// We use a property
const domains = appContext?.domains;

// We use a setter which will fire a render cycle with the change
const myEvent = () => {
  appContext?.setDomains(newDomains);
};
```

> Remember we mapped the set... function returned by useState hook
> for this callback, so we are calling a change of the state for
> the context. So it is calling a setDomain state, which is the one
> that trigger the render of the view.

## Final considerations

Similar approach could be followed when we want to define a context closer to some component,
such as the wizard page (not using this approach currently), but instead of wrapping the application
we would wrap an inner component.
