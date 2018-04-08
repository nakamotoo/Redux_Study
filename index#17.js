import React from "react"
import {Component} from "react"
import ReactDOM from "react-dom"
import {createStore} from "redux"
import {combineReducers} from "redux"

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


const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

let nextTodoId = 0; //global variable

class TodoApp extends Component{
  render(){
    return (
      <div>
        <input ref = {node => { this.input = node; }} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = ''; //dipatch後に入力欄内をリセット
        }}>
          Add Todo
        </button>
        <ul>
          {this.props.todos.map(todo =>
            <li key= {todo.id}>
              {todo.text}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp
      todos = {store.getState().todos}/>,
    document.getElementById('root')
  );
};

 //stateが変わるたびにrender()
store.subscribe(render);
//一番最初に呼び出す
render();
