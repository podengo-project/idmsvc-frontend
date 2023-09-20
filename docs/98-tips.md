# Good practices

## Document your components

Document, document, document. Today we are confident about what we are
coding, tomorrow maybe we have forgotten everything about that new,
fancy and awesome component. It is for you, for your team and the
community. A component that is well documented, can be enhanced by
other team mates or the community.

Use TSDoc to add documentation to your components.

See: https://tsdoc.org/

TODO Add examples.

## Break-Down the page and components

This is basically **divide and conquer** principle; smaller things are easier
to manage the change that big things. So given a view, decompose the view in
smaller components, until they can be managed easily. Create unit tests for
smaller components is easier than a big one, less use cases to cover, and
the functionality is more isolated.

- When breaking-down the pages and components, start by creating them at the
  `./src/Routes/MyPage/Components` directory of the page where they belong.
- At the moment that the component is used in more than one view, it is straight
  forward to refactor and move the shared component at `./src/Components/`
  directory.
- In this way we build shared components in an incremental way and as we need.

## Define an interface for the component properties

If the component you are developing require some property to customize
the render and behavior, define an interface to model them, and indicate
the types which it accepts. Typescript will do a great work here by validating
the values in the IDE and at coding/building time.

For instance:

```typescript
import './sample-component.scss';
import React from 'react';

/* SampleComponent component */

interface SampleComponentProps {
  name: string;
  description: string;
}

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
const SampleComponent = (props: SampleComponentProps) => {
  return <span className="sample-component"> {props.children} </span>;
};

export default SampleComponent;
```

## Define a state for the component

We will define an interface when an object or many states are
carried on; we can see an example below:

```typescript
import './sample-component.scss';
import React from 'react';

/* Interface for the properties */
interface SampleComponentProp {
  name: string;
  description: string;
}

/* Interface for the state */
interface SampleComponentState {
  name: string;
  description: string;
}

/* React component */
const SampleComponent = (props: SampleComponentProp) => {
  /* Define the states */
  const [state, setState] useState<SampleComponentState>({name: props.name, description: props.description});

  /* Define hooks for the event handlers */
  const onClick = () => {
    const newState = {...state, name:'new name'};
    setState(newState);
  };

  return <Button onClick={onClick}>{state.name} - {state.description}</Button>;
};

/* Export the component */
export default SampleComponent;
```

## Prefer hooks to classes

The syntax by using hooks simplify the readability for
React components, so it is preferred the hook syntax rather
the traditional class syntax.

Simple example below:

Hook Syntax:

```typescript
interface MyComponentProps {
  message: string;
}

interface MyState {
  count: number;
}

const MyComponent = (props: MyComponentProps) => {
  const [state, setState] = useState<MyState>({count: 0});
  return <span>MyComponent</span>;
};
export MyComponent;
```

Class Syntax:

```typescript
interface MyComponentProps {
  message: string;
}

interface MyState {
  count: number;
}
class MyComponent extends React.Component<MyProps, MyState> {
  state: MyState = {
    count: 0;
  }
  render() {
    return <span>I am a Car!</span>;
  }
}
```

## Forward properties when no levels or not many levels

The initial approach would be to define for a new component the interface
with the values to be passed as properties; this include values used and `events`
that will receive the parent component. This is the first immediate mechanism
to communicate with the parent component.

```typescript
interface MyComponentProps {
  value: string;
  onChange: (value: string) => void;
}

const MyComponent = (props: MyComponentProps) => {
  const [state, setState] = useState<string>(props.value);
  const onChange: (value: string) => {
    setState(value);
    props.onChange(state);
  };
  return (
    <input onChange={onChange} value={state} />
  );
};
```

In the above case, MyComponent receive the value to be displayed into
the `input` component, and when it is changed, the new value is send
to the parent component by calling the onChange callback provided by
the parent component.

## Use context when necessary

The most immediate way to pass information between the components
is by injecting them into the react component properties. This means
that for `<A><B><C></C></B></A>`, if `C` need some property from the
`A` component, the properties are passed down crossing the `B` component.

For instance: `<A propA={valueA}><B propA={valueA} propB={valueB}><C propA={valueA}></C></B></A>`

The above give us an idea about how can get complicated the situation.

To save this situation we can use React Context API which
allow us to define a context which can be accessed by the components
avoiding the property drilling situation.

Said this, we can quickly identify some specific cases for our repository:

- The current list of domains.
- The pagination state.
- The current domain, to show detailed information.
- The register domain in process, to show and update the info
  as we advance in the wizard.

## References

Helpful articles:

- [10 React Best Practices You Need to Follow In 2023](https://www.makeuseof.com/must-follow-react-practices/).
- [Redux vs Context API: When to use them](https://dev.to/ruppysuppy/redux-vs-context-api-when-to-use-them-4k3p).
- [How To Build An App With React Context API](https://dev.to/elijahtrillionz/how-to-build-an-app-with-react-context-api-512e).
- [React Tutorial](https://www.w3schools.com/react/).
- [React TypeScript CheatSheets](https://react-typescript-cheatsheet.netlify.app/).

About documenting the code:

- [Document Your React Application The Right Way](https://www.mohammadfaisal.dev/blog/document-your-react-applications-the-right-way).
- [Documenting Components](https://react-styleguidist.js.org/docs/documenting/).
