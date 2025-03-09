import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Component/Login";
import Main from "./Component/Main";
import Graph from "./Component/Graph";
import RecordBody from "./Component/RecordBody";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/" element={<Login />} />
        <Route path="/recordbody" element={<RecordBody />} />
      </Routes>
    </Router>
  );
}

export default App;
