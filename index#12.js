import React from "react"
import {render} from "react-dom"
import {createStore} from "redux"
import {Provider} from 'react-redux'

//reducer pureでなければならない
const todos = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO':
      return[
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
      case 'TOGGLE_TODO':
      //testToggleTodoの中のstateBeforeがmapされている
        return state.map(todo => {
          if(todo.id !== action.id){
            return todo;
          }
          return{
            ...todo,
            completed: !todo.completed
          };
        });
      //正体不明な操作にも結果を返せるようにdefault設定
      default:
        return state;
  }
};

const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  };
  const stateAfter = [
    {
      id : 0,
      text: 'Learn Redux',
      completed: false
    }
  ];
  //todos()はpureでないといけないので、以下の二つの引数は変わらない
  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

const testToggleTodo = () =>{
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: false
    }
  ];
  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: true
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);
  expect(
    todos(stateBefore,action)
  ).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
console.log('all test passed')
