
import * as ReactDOM from 'react-dom';
import { iu } from 'iu-ts';

interface UpdateStateOptions {
    rerender?: boolean
}

interface NodeAndUpdateValue {
    node: string,
    updateValue: any
}

export let globalState: any = {};

let stateSubsId = 0;
let stateSubs: { [key: number]: any } = {};
let stateManager = {
    subscribe: (func: any) => {
        stateSubs[stateSubsId] = func;
        stateSubsId++;
        return stateSubsId - 1;
    },
    emit() {
        Object.keys(stateSubs).forEach((key: any) => {
            stateSubs[key]();
        })
    }
};

const initState = (initialState: any) => {
    globalState = initialState;
};

export const getState = () => globalState;

const setState = (newState: any, options?: UpdateStateOptions) => {
    globalState = newState;
    if (options && !options.rerender) {
        // don't rerender
    } else {
        stateManager.emit();
    }
};

export const updateState = (node: string, newState: any, options?: UpdateStateOptions) => {
    setState(
        iu(getState(), node, newState), options
    );
}

export const updateMulti = (nodeAndUpdateValues: NodeAndUpdateValue[], options?: UpdateStateOptions) => {
    nodeAndUpdateValues.forEach((nodeAndUpdateValue, i) => {
        setState(
            iu(getState(), nodeAndUpdateValue.node, nodeAndUpdateValue.updateValue), (
                nodeAndUpdateValues.length - 1 === i ? options :  Object.assign({}, options, { rerender: false})
            )
        );
    });
}

export const app = (initialState: any, view: any, container: any) => {

    initState(initialState);

    stateManager.subscribe(() => {
        ReactDOM.render(
            view(),
            container
        );
    })

    // init render
    ReactDOM.render(
        view(),
        container
    );
}
