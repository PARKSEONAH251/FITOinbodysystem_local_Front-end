import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import "../Style/MealTimingselect.css"
import config from "../config";

export default function MealTimingselect() {
    const navigate = useNavigate();
    const [userid, setUserid] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date()); // 선택한 날짜 상태
    const [mealData, setMealData] = useState([]); // 식사 데이터 저장
    const [availableDates, setAvailableDates] = useState([]); // 기록이 있는 날짜 목록
    const mealTypes = ["moning", "lunch", "dinner", "desset"]; // 아침, 점심, 저녁

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

    const navigateFoodSearchR = () => {navigate("/FoodSearchR")};

    const navigatetodo = () => {navigate("/todo")};

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
        <div className="MealTimingselect_Container">
            {/* 백그라운드 이미지랑 텍스트트 */}
            <img src="/image/black.png" alt="Background" className="MainImage" />
            <a className="MealTimeingslelect_title">FitEnd</a>
            {/* <a className="FoodTitle">Food Food Food</a> */}
          <div className="content">
            {/* 꼭 필요한 배경이미지 */}
            <img src="/image/foodlist/Rectangleboder.png" alt="ground" className="Rectangleground_right"></img>
            <img src="/image/foodlist/Rectangleboder.png" alt="ground" className="Rectangleground_left"></img>
            <img src="/image/foodlist/Rectangleboder.png" alt="ground" className="Rectangleground_bottom_right"></img>
            <img src="/image/foodlist/Rectangleboder.png" alt="ground" className="Rectangleground_bottom_left"></img>
            <img src="/image/foodlist/toast_6168691.png" alt="toast" className="moning_toast"></img>
            <img src="/image/foodlist/noodles_4359781.png" alt="nodles" className="lunch_nodles"></img>
            <img src="/image/foodlist/roast-chicken_4490344.png" alt="roast_chicken" className="dinner_roast"></img>
            <img src="/image/foodlist/cupcake_497854.png" alt="cupcake" className="cupcake"></img>

            <a className="Moning">Moning</a>
            <a className="Lunch">LUNCH</a>
            <a className="Dinner">DINNER</a>
            <a className="Dessert">DESSERT</a>

            <button className="plus_button_left" onClick={navigateFoodSearchR}><img src="/image/foodlist/Group30.png" alt="plus"></img></button>
            <button className="plus_button_right" onClick={navigateFoodSearchR}><img src="/image/foodlist/Group30.png" alt="plus"></img></button>
            <button className="plus_button_bottomleft" onClick={navigateFoodSearchR}><img src="/image/foodlist/Group30.png" alt="plus"></img></button>
            <button className="plus_button_bottomright" onClick={navigateFoodSearchR}><img src="/image/foodlist/Group30.png" alt="plus"></img></button>

            <div className="meal-data">
              {/* 🍞 아침 (moning) */}
              <div className="meal-section moning">
                  <h3 className="meal-title"></h3>
                  {mealData.filter(record => record.dietMemo === "moning" && formatDate(new Date(record.timestamp)) === selectedDateFormatted).length > 0 ? (
                      <span className="meal-calories moning">
                          🔥 총 칼로리: {
                              mealData.filter(record => record.dietMemo === "moning" && formatDate(new Date(record.timestamp)) === selectedDateFormatted)
                              .reduce((sum, record) => sum + record.calories, 0)
                          } kcal
                      </span>
                  ) : (
                      <span className="meal-no-data moning">No records</span>
                  )}
              </div>

              {/* 🍜 점심 (lunch) */}
              <div className="meal-section lunch">
                  <h3 className="meal-title"></h3>
                  {mealData.filter(record => record.dietMemo === "lunch" && formatDate(new Date(record.timestamp)) === selectedDateFormatted).length > 0 ? (
                      <span className="meal-calories lunch">
                          🔥 총 칼로리: {
                              mealData.filter(record => record.dietMemo === "lunch" && formatDate(new Date(record.timestamp)) === selectedDateFormatted)
                              .reduce((sum, record) => sum + record.calories, 0)
                          } kcal
                      </span>
                  ) : (
                      <span className="meal-no-data lunch">No records</span>
                  )}
              </div>

              {/* 🍗 저녁 (dinner) */}
              <div className="meal-section dinner">
                  <h3 className="meal-title"></h3>
                  {mealData.filter(record => record.dietMemo === "dinner" && formatDate(new Date(record.timestamp)) === selectedDateFormatted).length > 0 ? (
                      <span className="meal-calories dinner">
                          🔥 총 칼로리: {
                              mealData.filter(record => record.dietMemo === "dinner" && formatDate(new Date(record.timestamp)) === selectedDateFormatted)
                              .reduce((sum, record) => sum + record.calories, 0)
                          } kcal
                      </span>
                  ) : (
                      <span className="meal-no-data dinner">No records</span>
                  )}
              </div>

              {/* 🍰 디저트 (dessert) */}
              <div className="meal-section dessert">
                  <h3 className="meal-title"></h3>
                  {mealData.filter(record => record.dietMemo === "desset" && formatDate(new Date(record.timestamp)) === selectedDateFormatted).length > 0 ? (
                      <span className="meal-calories dessert">
                          🔥 총 칼로리: {
                              mealData.filter(record => record.dietMemo === "desset" && formatDate(new Date(record.timestamp)) === selectedDateFormatted)
                              .reduce((sum, record) => sum + record.calories, 0)
                          } kcal
                      </span>
                  ) : (
                      <span className="meal-no-data dessert">No records</span>
                  )}
              </div>
            </div>
            <button className="greenbutton"></button>
            <span className="img-alt-text">Check meal details</span>

            <button className="Yellowbutton" onClick={navigatetodo}></button>
            <span className="img-alt-text-yellow">Calendar shortcuts</span>
          </div>
          {/* 기타 UI 구성 */}
          <div className="Button-Container">
            <div className="Button-Item">
              <img src="/image/HOME.png" alt="Main" className="ButtonImage" onClick={navigateMain} />
              <span className="Span">Main</span>
            </div>

            <div className="Button-Item">
              <img src="/image/PAPAR.png" alt="Paper" className="ButtonImage" onClick={navigateToRecordBody} />
              <span className="Span">Paper</span>
            </div>

            <div className="Button-Item">
              <img src="/image/Vector7.png" alt="rank" className="ButtonImage" onClick={navigateGraph} />
              <span className="Span">Graph</span>
            </div>

            <div className="Button-Item">
              <img src="/image/Vector8.png" alt="Food" className="ButtonImage" onClick={navigateFood}/>
              <span className="Span">Food</span>
            </div>

            <div className="Button-Item">
              <img src="/image/PEOPLE.png" alt="Logout" className="ButtonImage" onClick={handleLogout} />
              <span className="Span">Logout</span>
            </div>
          </div>
        </div>
    );
}
