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

//Linkをrenderするプロパティ
const Link = ({
  active,
  children,
  onClick
}) => {
  if (active){
    return <span>{children}</span>
  }
//currentfilterだったら、ただの黒文字、違ったらaタグのリンク
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

//container component
class FilterLink extends Component {
  componentDidMount(){
    const {store} = this.context;
    //stateに変更があれば、renderをforceする
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  componentWillUnmount(){
    this.unsubscribe();
  }
  //renderメソッドの中にstore.getsateのようにstoreを使うので、上のように最新のstoreにする
  //もし上の処理がなかったら、FilterLinkの親コンポーネント(TodoApp)がupdateせずにこれがupdateされると、最新の情報が反映されない
  render(){
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();

    return (
      <Link
      //props.filterはFooterコンポーネント内で渡されている
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

//presentational component
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

//presentational component
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

//presentational component
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
//presentational component
const AddTodo = (props, { store }) => {
  let input;

  return(
    <div>
      <input ref = {node => { input = node; }} />
      <button onClick={() => {
          store.dispatch({
            type:'ADD_TODO',
            id:nextTodoId++,
            text: input.value
          })
        input.value = ''; //dipatch後に入力欄内をリセット
      }}>
        Add Todo
      </button>
    </div>
  )
}
//contextを有効化するには、contexttypeの指定は必須,どのcontextを受け取りたいか
AddTodo.contextTypes = {
  store: PropTypes.object
};


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
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};
//dispatchメソッドを受けて, <TodoList />コンポーネントの onTodoClickというcallback propsにmapしている
const mapDispatchToProps = (dispatch) => {
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
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

//上の三つが以下のクラスを代替している

// class VisibleTodoList extends Component {
//   componentDidMount(){
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(() =>
//       this.forceUpdate()
//     );
//   }
//   componentWillUnmount(){
//     this.unsubscribe();
//   }
//
//   render() {
//     const props = this.props;
//     const { store } = this.context;
//     const state = store.getState();
//
//     return (
//       <TodoList
//         todos = {
//           getVisibleTodos(
//             state.todos,
//             state.visibilityFilter
//           )
//         }
//         onTodoClick = { id =>
//           store.dispatch({
//             type:'TOGGLE_TODO',
//             id
//           })
//         }
//       />
//     );
//   }
// }

//対応するcontextを受け取るのに必須
VisibleTodoList.contextTypes = {
  store: PropTypes.object
};

//container component
const TodoApp = () =>
    (
      <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
      </div>
    );

// class Provider extends Component{
//   getChildContext(){
//     return {
//       store: this.props.store
//     };
//   }
//   render(){
//     return this.props.children;
//   }
// }
// Provider.childContextTypes = {
//   store: PropTypes.object
// };

ReactDOM.render(
    <Provider store = {createStore(todoApp)} >
      <TodoApp />
    </Provider>,
    document.getElementById('root')
  );
