import React from "react"
import {Component} from "react"
import ReactDOM from "react-dom"
import {createStore} from "redux"
import {combineReducers} from "redux"
import PropTypes from "prop-types"
import {Provider} from "react-redux"
import {connect} from "react-redux"


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

class FilterLink extends Component {
  componentDidMount(){
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  componentWillUnmount(){
    this.unsubscribe();
  }
  render(){
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();

    return (
      <Link
        active = {props.filter === state.visibilityFilter}
        onClick = {() =>
          store.dispatch({
            type:'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
          }
      >
        {props.children}
      </Link>
    );
  }
}
FilterLink.contextTypes = {
  store: PropTypes.object
};

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

let nextTodoId = 0; //global variable
let AddTodo = ({ dispatch }) => {
  let input;
  return(
    <div>
      <input ref = {node => { input = node; }} />
      <button onClick={() => {
          dispatch({
            type:'ADD_TODO',
            id:nextTodoId++,
            text: input.value
          })
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  )
}
//AddTodoコンポーネントはconstでなくletだから、reassign可能
// AddTodo = connect(
//   //今回stateから生成するpropsはないので
//   state => {
//     return {},
//   },
//   dispatch => {
//     return { dispatch };
//   }
// )(AddTodo);

//このようにかける（第二引数nullだと、勝手に{dispatsh}自体がpropsに入る）
// AddTodo = connect( null, null )(AddTodo);
AddTodo = connect()(AddTodo);
//このconnectによりcontainer componentができて、{dispatch}をpropsとして渡しているので、<AddTodo />にpropsの受け渡し不要



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
      dispatch({
        type:'TOGGLE_TODO',
        id
      })
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
