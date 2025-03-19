import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "../Style/MealCalender.module.css"; // Import module CSS
import config from "../config";
import { FaCalendarAlt } from "react-icons/fa";

const MealCalendar = ({ mealData = [] }) => { // ✅ mealData 기본값을 빈 배열로 설정
  const navigate = useNavigate();
  const [userid, setUserid] = useState("");
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
    await fetch(`http://${config.SERVER_URL}/login/logout`, {
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
    if (!Array.isArray(mealRecords)) {
      // console.warn("mealData가 배열이 아닙니다!", mealRecords);
      return;
    }
  
    const formattedData = mealRecords.reduce((acc, record) => {
      const dateKey = formatDate(new Date(record.timestamp));
  
      if (!acc[dateKey]) {
        acc[dateKey] = { enerc: 0, meal: [] };
      }
  
      acc[dateKey].enerc += record.enerc;
      acc[dateKey].meal.push(record.dietMemo);
      return acc;
    }, {});
    // ✅ 기존 데이터와 다를 경우에만 업데이트
    if (JSON.stringify(mealRecords) !== JSON.stringify(formattedData)) {
      setMealRecords(formattedData);
    }
  }, [mealRecords, mealData]);

  useEffect(() => {
    // setSelectedDate(getTodayDate()); // 오늘 날짜로 기본 설정

    fetch(`http://${config.SERVER_URL}/login/validate`, {
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

        return fetch(`http://${config.SERVER_URL}/food/diet-records/${data.userid}`, {
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
        console.log("받은 데이터:", data);
        setMealRecords(data);
        // console.log("MealRecords:", mealRecords);
      })
      .catch((error) => {
        console.warn("인증 실패 또는 데이터 불러오기 실패:", error);
        navigate("/login");
      });
  }, [navigate]);


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
    <div className={styles.MealCalender_Container}>
      <img src="/image/black.png" alt="Background" className={styles.MealCalender_image} />
      <a className={styles.MealCalender_title}>FitEnd</a>
      <div className={styles.meal_calendar}>
       {/* 📌 월 변경 헤더 */}
      <div className={styles.calendar_header}>
        <button onClick={() => changeMonth(-1)}>⟪</button>
        <h2>{monthNames[month - 1]} {year}</h2> {/* ✅ 숫자 → 영어로 변경 */}
        <button onClick={() => changeMonth(1)}>⟫</button>
      </div>


        {/* 요일 헤더 */}
        <div className={styles.weekdays}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* 날짜 표시 */}
        <div className={styles.calendar_days}>
          {Array.from({ length: daysInMonth + startDay }).map((_, index) => {
            const day = index - startDay + 1;
            const dateKey = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            const isSelected = selectedDate === day;
            const hasData = mealRecords[dateKey];
            
            return index < startDay ? (
              <div key={`empty-${index}`} className={styles.empty_day}></div> // 빈 칸 추가
            ) : (
               <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`${styles.calendar_day} ${isSelected ? styles.selected : ""} ${hasData ? styles.hasData : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {selectedDate && (
            <div className={styles.selected_date_container}>
              <p className={styles.selected_date_text}>{year}년 {month}월 {selectedDate}일 선택됨</p>
              {/* 🔥 Debugging logs */}
              {/* {console.log("밀레코드:", mealRecords)}
              {console.log("체킹 데이트 키:", `${year}-${month.toString().padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`)} */}

              {/* 🔥 해당 날짜에 데이터가 존재하는지 확인 */}
              {mealRecords[`${year}-${month.toString().padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`] ? (
                <div className={styles.meal_data_container}>
                  <p className={styles.meal_data_text}>
                    {mealRecords[`${year}-${month.toString().padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`].meal.join(", ")}
                  </p>
                  <p className={styles.meal_data_text}>
                    🔥 {mealRecords[`${year}-${month.toString().padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`].enerc} kcal
                  </p>
                </div>
              ) : (
                <p className={styles.no_record_text}>기록 없음</p>
              )}
            </div>
          )}

      </div>
      {/* 기타 UI 구성 */}
      <div className={styles.buttonContainer}>
          <div className={styles.buttonItem}>
              <img src="/image/HOME.png" alt="Main" className={styles.buttonImage} onClick={navigateMain} />
              <span className={styles.span}>Main</span>
          </div>

          <div className={styles.buttonItem}>
              <img src="/image/PAPAR.png" alt="Paper" className={styles.buttonImage} onClick={navigateToRecordBody} />
              <span className={styles.span}>Paper</span>
          </div>

          <div className={styles.buttonItem}>
              <img src="/image/Vector7.png" alt="rank" className={styles.buttonImage} onClick={navigateGraph} />
              <span className={styles.span}>Graph</span>
          </div>

          <div className={styles.buttonItem}>
              <img src="/image/Vector8.png" alt="Food" className={styles.buttonImage} onClick={navigateFood} />
              <span className={styles.span}>Food</span>
          </div>

          <div className={styles.buttonItem}>
              <img src="/image/PEOPLE.png" alt="Logout" className={styles.buttonImage} onClick={handleLogout} />
              <span className={styles.span}>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default MealCalendar;
