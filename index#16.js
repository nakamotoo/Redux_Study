import React from "react"
import {render} from "react-dom"
import {createStore} from "redux"

//todoとtodosはreducer pureでなければならない
//ここの引数stateは個別のtodo
const todo = (state, action) => {
  switch(action.type){
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if(state.id !== action.id){
        return state;
      }
      return{
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};
//ここの引数stateはtodoの情報を集めた配列
const todos = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO':
      return[
        ...state,
        todo(undefined, action)
      ];
      case 'TOGGLE_TODO':
      //testToggleTodoの中のstateBeforeがmapされている
        return state.map(t => todo(t,action));
      //正体不明な操作にも結果を返せるようにdefault設定
      default:
        return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL',action) =>{
  switch (action.type){
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

//conmbinReducers()を一から作ってみる。reducer関数を受け取って、reducer関数を返す
const combineReducers = (reducers) => {
  //functionを返す
  return ( state = {}, action) => {
    //object.keys(reducers)はこの場合 [todos, visibilityfilter]
    return Object.keys(reducers).reduce(
      (nextState, key) => {
          nextState[key] = reducers[key](state[key], action);
          console.log(key);
          return nextState;
      },
      {}
    );
  };
};

// const todoApp = combineReducers({
//   todos,
//   visibilityFilter
// });

const todoApp = combineReducers({
  todos:todos,
  visibilityFilter: visibilityFilter
});

//combineReducersで、上のように書き換えられる
// const todoApp  = (state = {}, action) => {
//   return {
//     todos : todos(state.todos, action),
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//   };
// };

const store = createStore(todoApp);
console.log(store.getState());

store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux'
});
console.log(store.getState());

store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Go shopping'
});
console.log(store.getState());

store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0
});
console.log(store.getState());

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter:'SHOW_COMPLETED'
});
console.log(store.getState());
