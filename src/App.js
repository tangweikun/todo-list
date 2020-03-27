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
  doneIds: new Set(),
  isLoading: false
};

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "ADD":
      return {
        ...state,
        todos: [...state.todos, payload.task],
        isLoading: false
      };
    case "DELETE":
      state.doneIds.delete(payload.taskId);
      return {
        ...state,
        isLoading: false,
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
    case "LOADING":
      return { ...state, isLoading: true };
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, doneIds, isLoading } = state;
  const [newTask, setNewTask] = useState("");

  function _handleAdd() {
    if (newTask !== "") {
      dispatch({ type: "LOADING" });

      setTimeout(() => {
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
      }, 1000);
    }
  }

  function _handleDelete(taskId) {
    dispatch({ type: "LOADING" });

    setTimeout(() => {
      dispatch({
        type: "DELETE",
        payload: {
          taskId
        }
      });
    }, 1000);
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

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            opacity: 0.2,
            height: "100%",
            width: "100%"
          }}
        >
          <div className="loading">
            <span role="img" aria-label="close">
              ❄️
            </span>
          </div>
        </div>
      )}

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
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginLeft: "6px",
                  color: doneIds.has(item.id) ? "red" : "green",
                  textDecoration: doneIds.has(item.id)
                    ? "line-through"
                    : "unset"
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

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            value={newTask}
            onChange={_handleChange}
            style={{ padding: "4px" }}
          />
          <div
            onClick={_handleAdd}
            style={{
              cursor: "pointer",
              background: "grey",
              color: "#fff",
              border: "solid",
              width: "100px"
            }}
          >
            Add
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
