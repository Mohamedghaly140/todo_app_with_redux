// import { createStore, combineReducers } from "./MyRedux";
import { createStore, combineReducers } from "redux";

/** State Management **/

/* action specifiers */
// Set action types to variables to avoid typos
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";

/* Reducer */
const initialState = { todoItems: [] };

function reducer(state = initialState, action) {
  // Complete the reducer with appropriate logic

  switch (action.type) {
    // Add todo case
    case ADD_TODO:
      const todoItem = action.payload;
      return {
        ...state,
        todoItems: [...state.todoItems, todoItem]
      };

    // Remove todo case
    case REMOVE_TODO: {
      const todoId = action.payload;
      return {
        ...state,
        todoItems: state.todoItems.filter((todo) => todo.id !== todoId)
      };
    }

    // Toggle todo case
    case TOGGLE_TODO: {
      const todoId = action.payload;
      const selectedTodoIndex = state.todoItems.findIndex(
        (todo) => todo.id === todoId
      );
      const selectedTodo = state.todoItems[selectedTodoIndex];
      const updatedTodo = {
        ...selectedTodo,
        completed: !selectedTodo.completed
      };
      const beforeSelected = state.todoItems.slice(0, selectedTodoIndex);
      const afterSelected =
        todoId !== state.todoItems.length - 1
          ? state.todoItems.slice(selectedTodoIndex + 1)
          : [];

      return {
        ...state,
        todoItems: [...beforeSelected, updatedTodo, ...afterSelected]
      };
    }

    default:
      return state;
  }
}

// Create a store with createStore
const store = createStore(reducer);
// Extract getState, subscribe, dispatch from store
const { getState, dispatch, subscribe } = store;

/** UI **/
const form = document.getElementById("todo-form");
form.onsubmit = (e) => {
  e.preventDefault();
  // Form consists of "text" and "completed"
  const todoItem = { id: new Date().toISOString(), text: "", completed: false };
  // Build a new todo object, don't forget to append an ID
  const text = e.target[0].value;
  const completed = e.target[1].checked;
  console.log(text, completed);
  todoItem.text = text;
  todoItem.completed = completed;
  // Dispatch an action to add a new todo
  dispatch({ type: ADD_TODO, payload: todoItem });
  console.log(getState());
};

/* UI listener */
const onStateUpdate = () => {
  // Get updated state with getState
  const { todoItems } = getState();
  const todoList = document.getElementById("todo-list");

  // Clear existing todo items
  todoList.innerHTML = "";
  todoItems.forEach((t) => {
    const listItem = document.createElement("li");
    const p = document.createElement("p");
    const input = document.createElement("input");
    const button = document.createElement("button");
    /* t = {id, text, completed} */
    // Create html elements representing todo items with the new state
    /* List item > p, input<checkbox>, button */
    p.innerHTML = t.text;
    input.type = "checkbox";
    input.checked = t.completed;
    input.addEventListener("change", () => {
      dispatch({ type: TOGGLE_TODO, payload: t.id });
    });
    button.innerHTML = "delete";
    button.addEventListener("click", () => {
      dispatch({ type: REMOVE_TODO, payload: t.id });
    });
    // Append todo items to the todo list
    listItem.append(p, input, button);
    todoList.append(listItem);
  });
};

// Subscribe to state updates
subscribe(onStateUpdate);
