import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import config from "../config";

export default function MealTimingselect() {
    const navigate = useNavigate();
    const [userid, setUserid] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date()); // 선택한 날짜 상태
    const [mealData, setMealData] = useState([]); // 식사 데이터 저장
    const [availableDates, setAvailableDates] = useState([]); // 기록이 있는 날짜 목록
    const mealTypes = ["breakfast", "lunch", "dinner"]; // 아침, 점심, 저녁

    // 📅 날짜 포맷 변환 함수 (한국 시간 기준)
    const formatDate = (date) => {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
    };
    const navigateMain = () => {navigate("/main");};
    const navigateToRecordBody = () => {navigate("/recodbody");};
    const navigateFood=() => {navigate("/MealTimingselect");};
    const navigateGraph = () => {navigate("/Graph")};
    const handleLogout = async () => {
        await fetch(`http://${config.SERVER_URL}/request/logout`, {
            method: "POST",
            credentials: "include",
        });
        sessionStorage.removeItem("useridRef");
        navigate("/login");
    };

    const navigateFoodsearchR = (meal) => {
        navigate("/FoodSearchR", { state: { date: selectedDateFormatted, mealType: meal } });
      };
      
    useEffect(() => {
        fetch(`http://${config.SERVER_URL}/request/validate`, {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) throw new Error("Unauthorized");
                return response.json();
            })
            .then((data) => {
                console.log("로그인 상태 확인 성공:", data);
                setUserid(data.userid);
                return fetch(`http://${config.SERVER_URL}/request/diet-records/${data.userid}`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                  });
                })
                .then((response) => {
                  if (!response.ok) throw new Error("서버 응답 실패");
                  return response.json();
                })
                .then((data) => {
                //   console.log("📊 받은 데이터:", data);
                  setMealData(data);
          
                  // 기록이 있는 날짜 목록 만들기 (중복 제거 후 최신순 정렬)
                  const dates = [...new Set(data.map((record) => formatDate(new Date(record.timestamp))))].sort(
                    (a, b) => new Date(b) - new Date(a)
                  );
          
                //   console.log("🗓️ 기록이 있는 날짜:", dates);
                  setAvailableDates(dates);
                  setSelectedDate(dates[0] ? new Date(dates[0]) : new Date()); // 최신 날짜 선택 (없으면 오늘)
                })
                .catch((error) => {
                  console.warn("⚠️ 인증 실패 또는 데이터 불러오기 실패:", error);
                  navigate("/login");
                });
            }, [navigate]);

      // 선택한 날짜의 데이터 필터링
  
  const selectedDateFormatted = formatDate(selectedDate);
  const filteredData = mealData.filter((record) => formatDate(new Date(record.timestamp)) === selectedDateFormatted);

  // 각 식사 유형별 데이터 분류
  const mealsByType = mealTypes.reduce((acc, meal) => {
    acc[meal] = filteredData.filter((record) => record.dietMemo === meal);
    return acc;
  }, {});


    return (
        <div className="Main_Container">
            <img src="/image/black.png" alt="Background" className="MainImage" />
            <a className="maintitle">FitEnd</a>

           {/* 📅 캘린더 추가 */}
      <div className="calendar-container">
        <h3>날짜 선택</h3>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

        {/* 🍽️ 선택한 날짜의 식사 기록 */}
        <div className="meal-selection">
            {mealTypes.map((meal) => {
                // meal 타입별 칼로리 총합 계산
                const totalCalories = mealsByType[meal].reduce((sum, record) => sum + (record.enerc || 0), 0);

                return (
                <div key={meal} className="meal-button">
                    <span>{meal === "breakfast" ? "아침" : meal === "lunch" ? "점심" : "저녁"}</span>
                    <button onClick={() => navigateFoodsearchR(meal)}>+</button>
                    <div className="meal-data">
                    {mealsByType[meal].length > 0 ? (
                        <span>🔥 총 칼로리: {totalCalories} kcal</span> // 총 칼로리 출력
                    ) : (
                        <span>📭 기록 없음</span>
                    )}
                    </div>
                </div>
                );
            })}
            </div>
            <button onClick={() => navigate("/todo")}>내역 확인</button>
            <div className="button-container">
                {[
                    { img: "HOME.png", alt: "Main", action: navigateMain, label: "Main" },
                    { img: "PAPAR.png", alt: "Paper", action: navigateToRecordBody, label: "Paper" },
                    { img: "Vector7.png", alt: "Graph", action: navigateGraph, label: "Graph" },
                    { img: "Vector8.png", alt: "Food", action: navigateFood, label: "Food" },
                    { img: "PEOPLE.png", alt: "Logout", action: handleLogout, label: "Logout" },
                ].map(({ img, alt, action, label }, idx) => (
                    <div key={idx} className="button-item">
                        <img src={`/image/${img}`} alt={alt} className="buttonimage" onClick={action} />
                        <span className="span">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
