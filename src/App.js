import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./Component/Login";
import Main from "./Component/Main";
import RecordBody from "./Component/RecordBody";

import Graph from "./Component/Graph";
import RankPage from "./Component/RankPage";
import FoodList from "./Component/FoodList";
import FoodDetail from "./Component/FoodDetail";
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/main" component={Main} />
        <Route path="/" exact component={Login} />
        <Route path="/recodbody" exact component={RecordBody} />
        <Route path="/Graph" component={Graph} />
        <Route path="/rank" component={RankPage} />
        <Route path="/FoodList" component={FoodList} />
        <Route path="/FoodDetail" component={FoodDetail} />
      </Switch>
    </Router>
  );
}

export default App;
