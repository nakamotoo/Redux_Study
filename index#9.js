import React from "react"
import {render} from "react-dom"
import {createStore} from "redux"
import {Provider} from 'react-redux'

const addCounter = (list) => {
  return [...list,0];
};

const removeCounter = (list,index) => {
  return [
    ...list.slice(0,index),
    ...list.slice(index+1)
  ];
};

const incrementCounter = (list,index) => {
  return [
    ...list.slice(0,index),
    list[index]+1,
    ...list.slice(index+1)
  ];
};

const testAddCounter = (list) => {
  const listBefore = [];
  const listAfter = [0];

  deepFreeze(listBefore);

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
};

const testRemoveCounter = () => {
  const listBefore = [0,10,20];
  const listAfter = [0,20];

  deepFreeze(listBefore);

  expect(
    removeCounter(listBefore,1)
  ).toEqual(listAfter);
};

const testIncrementCounter = () => {
  const listBefore = [0,10,20];
  const listAfter = [0,11,20];

  deepFreeze(listBefore);

  expect(
    incrementCounter(listBefore,1)
  ).toEqual(listAfter);
}

testAddCounter();
testRemoveCounter();
testIncrementCounter();
console.log('all tests passed')

// expextとdeepfreezeを使うので、htmlファイルに以下を書き込むこと
// <script src="https://cdnjs.cloudflare.com/ajax/libs/expect/1.20.2/expect.min.js"></script>
// <script src="https://wzrd.in/standalone/deep-freeze@latest"></script>
