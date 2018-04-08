import React from "react"
import {render} from "react-dom"
import {createStore} from "redux"
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

const Counter = ({
  value,
  onIncrement,
  onDecrement
}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

//storeはreducerが引数として必要
const store = createStore(counter);
const rendering = () => {
  // document.body.innerText = store.getState();
  render(
    <Counter
      value={store.getState()}
      onIncrement={()=>
        store.dispatch({
          type: 'INCREMENT'
        })
      }
      onDecrement={()=>
        store.dispatch({
          type: 'DECREMENT'
        })
      }
    />,
    document.getElementById('root')
  );
};
store.subscribe(rendering); //stateが変わるたびにrenderingが呼び出される
rendering(); //初期値state=0をrenderするため
