// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import { Reducer, createStore } from ".";
import { setSubValueAction } from "./actions";

export type State = {
  value: string;
  obj: {
    subValue: string;
  };
};

describe("Redux", () => {
  it("Should create and get a store", () => {
    // GIVEN
    const store = createStore<State>({
      value: "Hello",
      obj: {
        subValue: "Coucou",
      },
    });

    // WHEN
    const state = store.getState();

    // THEN
    expect(state.value).toEqual("Hello");
    expect(state.obj.subValue).toEqual("Coucou");
  });

  it("Should set and get a store", () => {
    // GIVEN
    const subValueReducer: Reducer<State["obj"]["subValue"]> = (action) => (state) => action.payload;
    const objReducer: Reducer<State["obj"]> = (action) => (state) => {
      return {
        ...state,
        subValue: subValueReducer(action)(state.subValue),
      };
    };
    const reducer: Reducer<State> = (action) => (state) => {
      switch (action.type) {
        case "SET_SUB_VALUE":
          return {
            ...state,
            obj: objReducer(action)(state.obj),
          };

        default:
          return state;
      }
    };
    const store = createStore<State>(
      {
        value: "Hello",
        obj: {
          name: "Guillaume",
          subValue: "Coucou",
        },
      },
      [reducer],
    );

    // WHEN
    store.dispatch(setSubValueAction("New value"));
    const newState = store.getState();

    // THEN
    expect(newState.value).toEqual("Hello");
    expect(newState.obj.subValue).toEqual("New value");
  });
});