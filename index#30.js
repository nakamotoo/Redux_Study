import React from "react"
import {Component} from "react"
import ReactDOM from "react-dom"
import {createStore} from "redux"
import {combineReducers} from "redux"
import PropTypes from "prop-types"
import {Provider} from "react-redux"
import {connect} from "react-redux"

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

//action creators
let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type:'ADD_TODO',
    id: nextTodoId++,
    text
  };
};

const setVisibilityFilter = (filter) => {
  return {
    type:'SET_VISIBILITY_FILTER',
    filter
  };
};

const toggleTodo = (id) => {
  return{
    type:'TOGGLE_TODO',
    id
  };
};

// components

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active){
    return <span>{children}</span>
  }
  return(
    <a href = '#'
       onClick = {e =>{
         e.preventDefault();
         onClick();
       }}
    >
      {children}
    </a>
  )
};

const mapStateToLinkProps = (
  state,
  ownProps //FilterLink(代替したいcontainer component自身)のfilterというpropsを参照しないといけないので
) => {
  return {
    active :
      ownProps.filter ===
      state.visibilityFilter
  };
};

const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch(
        setVisibilityFilter(ownProps.filter)
      );
    }
  };
};

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

const Footer  = () => (
  <p>
    Show:
    {'  '}
    <FilterLink
      filter = 'SHOW_ALL'
    >
      All
    </FilterLink>
    {'  '}
    <FilterLink
      filter = 'SHOW_ACTIVE'
    >
      Acive
    </FilterLink>
    {'  '}
    <FilterLink
      filter = 'SHOW_COMPLETED'
    >
      Completed
    </FilterLink>
  </p>
)

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
      onClick={onClick}
      style = {{
        textDecoration:
          completed ? 'line-through' : 'none'
      }}>
    {text}
  </li>
);

const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key = {todo.id}
        {...todo} //text completedなどがスプレッドされる
        onClick = {() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

let AddTodo = ({ dispatch }) => {
  let input;
  return(
    <div>
      <input ref = {node => { input = node; }} />
      <button onClick={() => {
          dispatch(addTodo(input.value));
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  )
}
AddTodo = connect()(AddTodo);

const getVisibleTodos = (todos, filter) =>{
  switch(filter){
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  };
};

//reduxStoreのstateを受けて、<TodoList />というコンポーネントのprops（todos）にmapしている
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};
//dispatchメソッドを受けて, <TodoList />コンポーネントの onTodoClickというcallback propsにmapしている
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id));
    }
  };
};
//最後の引数は、propsを渡したいpresentational componentに名前
const VisibleTodoList = connect (
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

const TodoApp = () =>
    (
      <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
      </div>
    );

ReactDOM.render(
    <Provider store = {createStore(todoApp)} >
      <TodoApp />
    </Provider>,
    document.getElementById('root')
  );
