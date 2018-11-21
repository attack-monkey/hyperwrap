
import * as ReactDOM from 'react-dom';
import { iu } from 'iu-ts';

export let globalState: any = {};

let stateSubsId = 0;
let stateSubs: {[key: number]: any} = {};
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

export const setState = (newState: any) => {
    globalState = newState;
    stateManager.emit();
};

export const updateState= (node: string, newState: any) => {
    setState(
        iu(getState(), node, newState)
    );
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
