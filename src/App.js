import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Component/Login";
import Main from "./Component/Main";
import RecordBody from "./Component/RecordBody";
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/main" component={Main} />
        <Route path="/" exact component={Login} />
        <Route path="/recodbody" exact component={RecordBody} />
      </Switch>
    </Router>
  );
}

export default App;
