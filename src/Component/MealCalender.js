import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../Style/MealCalender.css";
import config from "../config";
import { FaCalendarAlt } from "react-icons/fa";

const MealCalendar = ({ mealData = [] }) => { // ✅ mealData 기본값을 빈 배열로 설정
  const navigate = useNavigate();
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(3);
  const [selectedDate, setSelectedDate] = useState(null);
  const [mealRecords, setMealRecords] = useState({}); // ✅ 정리된 데이터 저장

  // 📌 월의 시작 요일을 월요일(0)부터 시작하도록 조정
  const rawStartDay = new Date(year, month - 1, 1).getDay();
  const startDay = (rawStartDay === 0 ? 6 : rawStartDay - 1); // 0(일요일) → 6, 그 외는 -1 적용

  
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

  // 📅 날짜 포맷 변환 함수
  const formatDate = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    if (!Array.isArray(mealData)) {
      console.warn("mealData가 배열이 아닙니다!", mealData);
      return;
    }
  
    const formattedData = mealData.reduce((acc, record) => {
      const dateKey = formatDate(new Date(record.timestamp));
  
      if (!acc[dateKey]) {
        acc[dateKey] = { calories: 0, meal: [] };
      }
  
      acc[dateKey].calories += record.calories;
      acc[dateKey].meal.push(record.dietMemo);
      return acc;
    }, {});
  
    // ✅ 기존 데이터와 다를 경우에만 업데이트
    if (JSON.stringify(mealRecords) !== JSON.stringify(formattedData)) {
      setMealRecords(formattedData);
    }
  }, [mealData]);

  // const isSelected = selectedDate === day;

  const handleDateClick = (day) => {
    setSelectedDate(day); // ✅ 날짜 객체가 아니라 숫자로 저장
  };  
  // ✅ 현재 월의 총 일 수 가져오기
  const daysInMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const changeMonth = (offset) => {
    let newMonth = month + offset;
    let newYear = year;
  
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
  
    // ✅ 변경되지 않은 경우 `setState` 실행 방지
    if (newMonth !== month || newYear !== year) {
      setYear(newYear);
      setMonth(newMonth);
      setSelectedDate(null);
    }
  };
  

  return (
    <div className="MealCalender_Container">
      <img src="/image/black.png" alt="Background" className="MealCalender_image" />
      <a className="MealCalender_title">FitEnd</a>
      <div className="meal-calendar">
       {/* 📌 월 변경 헤더 */}
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>⟪</button>
        <h2>{monthNames[month - 1]} {year}</h2> {/* ✅ 숫자 → 영어로 변경 */}
        <button onClick={() => changeMonth(1)}>⟫</button>
      </div>


        {/* 요일 헤더 */}
        <div className="weekdays">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* 날짜 표시 */}
        <div className="calendar-days">
          {Array.from({ length: daysInMonth + startDay }).map((_, index) => {
            const day = index - startDay + 1;
            const dateKey = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            const isSelected = selectedDate === day;
            const hasData = mealRecords[dateKey];

            return index < startDay ? (
              <div key={`empty-${index}`} className="empty-day"></div> // 빈 칸 추가
            ) : (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`calendar-day ${isSelected ? "selected" : ""} ${hasData ? "has-data" : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* 선택된 날짜 정보 */}
        {selectedDate && (
          <div className="selected-date-container">
            <p className="selected-date-text">{year}년 {month}월 {selectedDate}일 선택됨</p>

            {/* 🔥 해당 날짜에 데이터가 존재하는지 확인 */}
            {mealRecords[`${year}-${month.toString().padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`] ? (
              <>
                <p className="meal-data-text">
                  {mealRecords[`${year}-${month.toString().padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`].meal.join(", ")}
                </p>
                <p className="calorie-data-text">
                  🔥 {mealRecords[`${year}-${month.toString().padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`].calories} kcal
                </p>
              </>
            ) : (
              <p className="no-record-text">기록 없음</p>
            )}
          </div>
        )}

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
};

export default MealCalendar;
