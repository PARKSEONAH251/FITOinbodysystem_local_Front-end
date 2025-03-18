import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Register from "./Component/Register";
import Login from "./Component/Login";
import Main from "./Component/Main"; // 메인 화면 컴포넌트
import RecordBody from "./Component/RecordBody";
import Graph from "./Component/Graph";
import RankPage from "./Component/RankPage";
import Mealdetail_Todo from "./Component/Mealdetail_Todo";
import ClickThis from "./Component/ClickThis";
import FoodSearchR from "./Component/FoodSearchR";
import MealTimingselect from "./Component/MealTimingselect"; 
import MealCalender from "./Component/MealCalender";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/" element={<Login />} />
        <Route path="/recodbody" element={<RecordBody />} />
        <Route path="/rank" element={<RankPage />} />
        <Route path="/Calender" element={<MealCalender/>}/>
        {/* 캘린더 페이지 */}
        <Route path="/Todo" element={<Mealdetail_Todo />} />
        {/* 음식데이터 보여줌줌 */}
        <Route path="/ClickThis" element={<ClickThis />} />
        {/* 음식데이터베이스 가지고옴옴 */}
        <Route path="/graph" element={<Graph />} />
        <Route path="/FoodSearchR" element={<FoodSearchR />} /> 
        {/* 음식 검색 데이터터 */}
        <Route path="/MealTimingselect" element={<MealTimingselect/>}/>
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
