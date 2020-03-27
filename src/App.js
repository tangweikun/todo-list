import React, { useReducer, useState } from "react";
import "./App.css";

const initialState = {
  todos: [
    {
      title: "Learn react",
      isDone: false,
      id: Math.random()
        .toString(16)
        .slice(6)
    },
    {
      title: "Go shopping",
      isDone: false,
      id: Math.random()
        .toString(16)
        .slice(6)
    }
  ],
  doneIds: new Set()
};

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "ADD":
      return { ...state, todos: [...state.todos, payload.task] };
    case "DELETE":
      state.doneIds.delete(payload.taskId);
      return {
        ...state,
        todos: state.todos.filter(x => x.id !== payload.taskId),
        doneIds: state.doneIds
      };
    case "DONE":
      state.doneIds.add(payload.id);
      return {
        ...state,
        doneIds: state.doneIds
      };
    case "UNDO":
      state.doneIds.delete(payload.id);
      return { ...state, doneIds: state.doneIds };
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, doneIds } = state;
  const [newTask, setNewTask] = useState("");

  function _handleAdd() {
    if (newTask !== "") {
      dispatch({
        type: "ADD",
        payload: {
          task: {
            title: newTask,
            id: Math.random()
              .toString(16)
              .slice(6)
          }
        }
      });
      setNewTask("");
    }
  }

  function _handleDelete(taskId) {
    dispatch({
      type: "DELETE",
      payload: {
        taskId
      }
    });
  }

  function _handleDone(id) {
    dispatch({
      type: "DONE",
      payload: {
        id
      }
    });
  }

  function _handleUndo(id) {
    dispatch({
      type: "UNDO",
      payload: {
        id
      }
    });
  }

  function _handleChange(e) {
    setNewTask(e.target.value);
  }

  console.log(todos, doneIds);

  return (
    <div className="container">
      <div className="title">Demo</div>
      <div>
        {todos.map(item => (
          <div key={item.id} className="row">
            <span
              role="img"
              aria-label="checked"
              onClick={() =>
                doneIds.has(item.id)
                  ? _handleUndo(item.id)
                  : _handleDone(item.id)
              }
            >
              ✔️
            </span>
            <span
              style={{
                marginLeft: "6px",
                color: doneIds.has(item.id) ? "red" : "green",
                textDecoration: doneIds.has(item.id) ? "line-through" : "unset"
              }}
            >
              {item.title}
            </span>
            <span style={{ flexGrow: 1 }}></span>
            <span
              onClick={() => _handleDelete(item.id)}
              role="img"
              aria-label="close"
            >
              ❌
            </span>
          </div>
        ))}
      </div>

      <input value={newTask} onChange={_handleChange} />
      <div onClick={_handleAdd}>Add</div>
    </div>
  );
}

export default App;
