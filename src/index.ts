export type Action = { type: string; payload: any };

export type Reducer<State> = (action: Action) => (state: State) => State;

type Store<State> = {
  setState: (state: State) => void;
  getState: () => State;
  dispatch: (action: Action) => void;
};

export const createStore = <State extends {}>(
  initialState = {},
  initialReducers: Reducer<State>[] = [],
): Store<State> => {
  let state = initialState as State;

  const reducers = initialReducers;

  const setState = (newState: State): void => {
    state = newState;
  };

  const getState = (): State => state;

  const dispatch = (action: Action) => {
    reducers.forEach((reducer) => {
      setState(reducer(action)(state));
    });
  };

  return {
    setState,
    getState,
    dispatch,
  };
};
