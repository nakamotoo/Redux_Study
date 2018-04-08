import React from "react"
import {render} from "react-dom"
import {createStore} from "redux"
import {Provider} from 'react-redux'

const toggleTodo = (todo) => {
  return Object.assign({},todo,{completed : !todo.completed});
  // return{
  //   ...todo,
  //   completed: !todo.completed
  // };
};

const testToggleTodo = () => {
  const todoBefore = {
    id: 0,
    text: 'Learn Redux',
    completed: false
  };
  const todoAfter = {
    id: 0,
    text:'Learn Redux',
    completed: true
  };

  deepFreeze(todoBefore);

  expect(
    toggleTodo(todoBefore)
  ).toEqual(todoAfter);
};

testToggleTodo();

console.log('all tests passed')
