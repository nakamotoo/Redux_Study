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

//Linkをrenderするプロパティ
const FilterLink = ({
  filter,
  currentFilter,
  children
}) => {
  if (filter === currentFilter){
    return <span>{children}</span>
  }
//currentfilterだったら、ただの黒文字、違ったらaタグのリンク
  return(
    <a href = '#'
       onClick = {e =>{
         e.preventDefault();
         store.dispatch({
           type: 'SET_VISIBILITY_FILTER',
           filter
         });
       }}
    >
      {children}
    </a>
  )
};
//いつもの慣れてる書き方だったら
// const FilterLink = (props) => {
//   if (props.filter === props.currentFilter){
//     return <span>{props.children}</span>
//   }
//
//   return(
//     <a href = '#'
//        onClick = {e =>{
//          e.preventDefault();
//          store.dispatch({
//            type: 'SET_VISIBILITY_FILTER',
//            filter:props.filter
//          });
//        }}
//     >
//       {props.children}
//     </a>
//   )
// };


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
  }
}

let nextTodoId = 0; //global variable
class TodoApp extends Component{
  render(){
    const {
      todos,
      visibilityFilter
    } = this.props;
    //getvisibletodosの引数にtodosとvisibilityfilterを代入
    const visibleTodos = getVisibleTodos(
      todos,
      visibilityFilter
    );

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
          {visibleTodos.map(todo =>
            <li key= {todo.id}
                onClick={() => {
                  store.dispatch({
                    type: 'TOGGLE_TODO',
                    id:todo.id
                  });
                }}
                style = {{
                  textDecoration:
                    todo.completed ? 'line-through' : 'none'
                }}>
              {todo.text}
            </li>
          )}
        </ul>
        <p>
          Show:
          {'  '}
          <FilterLink
            filter = 'SHOW_ALL'
            currentFilter = {visibilityFilter}
          >
            All
          </FilterLink>
          {'  '}
          <FilterLink
            filter = 'SHOW_ACTIVE'
            currentFilter = {visibilityFilter}
          >
            Acive
          </FilterLink>
          {'  '}
          <FilterLink
            filter = 'SHOW_COMPLETED'
            currentFilter = {visibilityFilter}
          >
            Completed
          </FilterLink>
        </p>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp
      {...store.getState()}
      // todos = {store.getState().todos}
      // visibilityFilter = {store.getState().visibilityFilter}
    />,
    document.getElementById('root')
  );
};

 //stateが変わるたびにrender()
store.subscribe(render);
//一番最初に呼び出す
render();
