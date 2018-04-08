import React from "react"
import {render} from "react-dom"
// import {createStore} from "redux"
import {Provider} from 'react-redux'

//reducer
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state,action);
    listeners.forEach(listener => listener());
  };
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener)
    };
  };
  dispatch({}); //これがないと初期値０がundefinedになる

  return { getState, dispatch, subscribe };
};


//storeはreducerが引数として必要
const store = createStore(counter);
const rendering = () => {
  document.body.innerText = store.getState();
};
store.subscribe(rendering);
rendering(); //初期値state=0をrenderするため
document.addEventListener('click',()=>{
  store.dispatch({type:"INCREMENT"});
});
