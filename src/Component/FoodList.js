import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../Style/FoodList.css'
export default function FoodList() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date()); // 현재 날짜 선택
  const [mealRecords, setMealRecords] = useState({ breakfast: 0, lunch: 0, dinner: 0 }); // 끼니별 칼로리
  const [totalCalories, setTotalCalories] = useState(0); // 총 섭취 칼로리

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
  
    // 오늘 날짜보다 미래의 날짜가 선택되는 것을 방지
    const today = new Date();
    if (newDate > today) {
      setSelectedDate(today);  // 새로운 날짜가 오늘보다 크면 오늘 날짜로 설정
    } else {
      setSelectedDate(newDate);
    }
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 더미 데이터로 끼니별 칼로리 업데이트 (서버에서 데이터 불러오는 부분)
  useEffect(() => {
    // 여기에 백엔드 API 호출 로직 추가 (예: fetch(`/api/calories?date=${selectedDate}`))
    const dummyData = {
      breakfast: Math.floor(Math.random() * 500),
      lunch: Math.floor(Math.random() * 700),
      dinner: Math.floor(Math.random() * 800),
    };
    setMealRecords(dummyData);
    setTotalCalories(dummyData.breakfast + dummyData.lunch + dummyData.dinner);
  }, [selectedDate]);

  const navigateToFoodDetail = (mealType) => {
    navigate(`/FoodDetail?meal=${mealType}&date=${selectedDate.toISOString().split('T')[0]}`);
  };


  const navigateMain = () => {
    navigate("/main");
  }

  const navigateToRecordBody = () => {
    navigate("/recodbody");
  };

  const navigateGraph = () => {
    navigate("/Graph")
  }

const navigateFood = ()=>{
  navigate("/FoodList")
}

const handleLogout = () => {
  sessionStorage.removeItem("userid"); // 로그아웃 시 사용자 정보 삭제
  navigate("/login"); // 로그인 페이지로 이동
};

  return (
    <div>
    <div className="Main_Container">
      <img src="/image/black.png" alt="Background" className="MainImage" />
      <a className="maintitle">FitEnd</a>

              {/* 날짜 선택 영역 */}
              <div className="date-selector">
          <button onClick={() => changeDate(-1)}>◀</button>
          {[...Array(5)].map((_, index) => {
            const date = new Date();
            date.setDate(selectedDate.getDate() - 2 + index);
            return (
              <span
                key={index}
                className={`date-item ${date.toDateString() === selectedDate.toDateString() ? "selected" : ""}`}
                onClick={() => setSelectedDate(date)}
              >
                {formatDate(date)}
              </span>
            );
          })}
          <button onClick={() => changeDate(1)}>▶</button>
        </div>

      {/* 총 섭취한 칼로리 */}
      <div className="total-calories">
        총 섭취 칼로리: <span className="calories">{totalCalories} kcal</span>
      </div>

      {/* 식사 기록 */}
      <div className="meal-records">
        {["breakfast", "lunch", "dinner"].map((meal, index) => (
          <div key={index} className="meal-item">
            <span className="meal-name">{meal === "breakfast" ? "아침" : meal === "lunch" ? "점심" : "저녁"}</span>
            <span className="meal-calories">{mealRecords[meal]} kcal</span>
            <button className="add-button" onClick={() => navigateToFoodDetail(meal)}>
                +
              </button>
          </div>
        ))}
      </div>
        
        <div className="button-container">
          <div className="button-item">
            <img src="/image/HOME.png" alt="Main" className="buttonimage" onClick={navigateMain} />
            <span className="span">Main</span> {/* 이미지 아래에 텍스트 추가 */}
          </div>

          <div className="button-item">
            <img src="/image/PAPAR.png" alt="Paper" className="buttonimage" onClick={navigateToRecordBody} />
            <span className="span">Paper</span> {/* 이미지 아래에 텍스트 추가 */}
          </div>

          <div className="button-item">
            <img src="/image/Vector7.png" alt="Graph" className="buttonimage" onClick={navigateGraph} />
            <span className="span">Graph</span> {/* 이미지 아래에 텍스트 추가 */}
          </div>

          <div className="button-item">
            <img src="/image/Vector8.png" alt="Food" className="buttonimage" onClick={navigateFood}/>
            <span className="span">Food</span> {/* 이미지 아래에 텍스트 추가 */}
          </div>

          <div className="button-item">
            <img src="/image/PEOPLE.png" alt="Logout" className="buttonimage" onClick={handleLogout} />
            <span className="span">Logout</span> {/* 이미지 아래에 텍스트 추가 */}
          </div>
        </div>
      </div>
      
    </div>
  );
}