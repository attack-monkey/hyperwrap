# Meet hyperwrap

Hyperwrap embodies the principles of hyperapp and transfers them to react, turning react into a simple to use functional framework.

# A few notes

- Hyperwrap is written in typescript
- In Hyperwrap there is no local state and no class components to worry about.
- Immutable state changes are simple - even with a deeply nested object.

# Install

The easiest way to get going is to install the seed project using `douglas`.  
douglas installs npm modules as ready to roll projects...

If you don't have douglas, install globally with `npm i -g douglas`

Install hyperwrapped-react (seed project)

```

douglas get hyperwrapped-react

```

# Start

> If you haven't used parcel-bundler before, then install globally with `npm i -g parcel-bundler` ... then ...

```

npm start

```

# Basics

Hyperwrap is an app function that wraps around React.  
When Hyperwrap's state changes - it rerenders React.

A typical entry index.tsx looks like...

```javascript

import { app } from "hyperwrap";
import { initialState } from "./src/state/state";
import { View } from "./src/components/view/view.component";

app(initialState, View, document.getElementById('app'));

```

> initialState is just a plain js object.  
> View is just a plain React functional component

# Get and Update State (Basics)

In Hyperwrap, actions are just functions.  
Those functions can change global state, which in turn rerenders the application.

> Remember - in Hyperwrapp, state is global.

`getState()` gets global state and `updateState()` updates it...

```javascript

import * as React from 'react';
import { State } from '../../../state/state';
import { getState, updateState } from 'hyperwrap';

export const Home = () => {

    const changeThing = (e: any, thing: string) => { updateState('thing', thing); };
    return (
        <div>
            <p>{getState().thing}</p>
            <button onClick={(e) => {changeThing(e, 'bob')} }>push</button>
        </div>
    );
};

```

# Making the above pure and testable

We've changed the above code, so we can inject both state and actions into the functional component.

This makes the component pure, and easier to test.

Note that the function `changeThing` has also been moved out to it's own module.  
We then assign changeThing to an `actionsCollection`, which we inject in as `actions`.

> Since typescript thinks that `state` and `actions` may be undefined, we include the lines ...
```
...
const _state = state || getState();
const _actions = actions || actionsCollection;
...
```
> This ensures that `_state` and `_actions` are definitely NOT undefined.  
> We then use `_state` and `_actions` throughout the component.

```javascript

import * as React from 'react';
import { State } from '../../../state/state';
import { Actions } from '../../../actions/actions';
import { getState } from 'hyperwrap';
import { changeThing } from './change-thing.function';

interface Props {
    state?: State;
    actions?: Actions;
}

const actionsCollection = {
    changeThing: changeThing
}

export const Home = (
    {state, actions}: Props = {
        state: getState(),
        actions: actionsCollection
    }
) => {
    const _state = state || getState();
    const _actions = actions || actionsCollection;
    return (
        <div>
            <p>{_state.thing}</p>
            <button onClick={(e) => {_actions.changeThing(e, 'bob')} }>push</button>
        </div>
    );
};

```

# Updating State (Advanced)

To update state, specify the node in the state object to update, followed by the value.

```javascript

updateState('deep/nested/thing', newValue);

```

*Adding nodes* - Use the above. If parent nodes aren't created yet, they will be created for you.

*Deleting nodes* - Make the newValue undefined. Any parent node clean up will also be taken care of.

## Updating without rerendering

By default hyperwrap will rerender your React app on state change.

If however you are making multiple state changes at once - this is not ideal.

Instead pass the  `{ rerender: false }` flag to stop the app from rerendering...

```javascript

updateState('deep/nested/thing', newValue, {rerender: false});

```

## Updating multiple nodes at once

The following can be used to update multiple state nodes, before re-rendering...

```javascript

updateMulti([
  { node: 'deep/nested/thing', updateValue: newValue1 },
  { node: 'another/deep/nested/thing', updateValue: newValue2 }
]);

```
Again, if you don't want to rerender after the state updates - pass the `{ rerender: false }` flag.

e.g.

```javascript

updateMulti([
  { node: 'deep/nested/thing', updateValue: newValue1 },
  { node: 'another/deep/nested/thing', updateValue: newValue2 }
], {
  rerender: false
});

```