# Meet hyperwrap

Hyperwrap (inspired by hyperapp) turns react into a simple to use **functional framework**.

# A few notes

- In Hyperwrap there is no local state and no class components to worry about.
- Hyperwrap makes global state management simple.
- Hyperwrap is written in **typescript**.

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

Hyperwrap is an `app` function that wraps around React.  
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

Let's say our initialState is ...

```

{
    thing: 'not bob',
    anotherThing: 'something else'
}

```

The following component illustrates how to interact with state using `getState` and `updateState`...

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

> Note that even though we update `state.thing` to 'bob', `state.anotherThing` remains unaffected.

# Making the above pure and testable

- We've moved `changeThing` to it's own module
- We've made `state` and `actions` as optional props to our functional component.
- We've set default values for `state` and `actions`.

_This lets us to inject mock values for state and actions, for easier testing + now it's a pure function_

```javascript

import * as React from 'react';
import { State } from '../../../state/state';
import { getState } from 'hyperwrap';
import { changeThing } from './change-thing.function';


interface Props {
    state?: State;
    actions?: { [key: string]: any }
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

**Adding nodes** - Use the above. If parent nodes aren't created yet, they will be created for you.

**Deleting nodes** - Make the `newValue` undefined. Any parent nodes will also be removed if they do not have children.

## Updating without rerendering

By default hyperwrap rerenders an app on state change.

There will be times however where this is not ideal.

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
