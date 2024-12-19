import { useState } from "react";
import Game from "./components/Game";
import "./App.css";
import "./styles/generic.css";

function App() {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [formName, setFormName] = useState("");
  const submitHandler = () => {
    console.log(name);
    setName(formName);
    setFormName("");
    localStorage.setItem("name", formName);
  };
  return (
    <>
      <h1>SPOT THE BALL!!!</h1>
      {!name && (
        <>
          {" "}
          <input
            placeholder="name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <button onClick={submitHandler}>Submit</button>
        </>
      )}
      {name && <Game name={name} />}
    </>
  );
}

export default App;
