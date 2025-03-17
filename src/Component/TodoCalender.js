import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import "../Style/TodoCalender.css";

export default function TodoCalender() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [userid, setUserid] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // 선택한 날짜 상태
  const [availableDates, setAvailableDates] = useState(new Set()); // 선택 가능 날짜 목록

  // 네비게이션 함수
  const navigateMain = () => navigate("/main");
  const navigateToRecordBody = () => navigate("/recodbody");
  const navigateFood = () => navigate("/MealTimingselect");
  const navigateGraph = () => navigate("/Graph");

  // 로그아웃 처리
  const handleLogout = async () => {
    await fetch(`http://${config.SERVER_URL}/login/logout`, {
      method: "POST",
      credentials: "include",
    });

    sessionStorage.removeItem("useridRef");
    navigate("/login");
  };

  // 오늘 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // 사용자 데이터 불러오기
  useEffect(() => {
    setSelectedDate(getTodayDate()); // 오늘 날짜로 기본 설정

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
        setUserData(data);

        // 데이터가 있는 날짜만 저장 & 최신순 정렬
        const dates = [...new Set(data.map((record) => new Date(record.timestamp).toISOString().split("T")[0]))]
        .sort((a, b) => new Date(b) - new Date(a)); // 최신순 정렬

        setAvailableDates(dates);
        setSelectedDate(dates[0] || getTodayDate()); // 최신 날짜 선택 (없으면 오늘 날짜)
      })
      .catch((error) => {
        console.warn("인증 실패 또는 데이터 불러오기 실패:", error);
        navigate("/login");
      });
  }, [navigate]);

  // 선택한 날짜의 데이터 필터링
  const filteredData = userData.filter((record) => {
    const recordDate = new Date(record.timestamp).toISOString().split("T")[0]; // YYYY-MM-DD 형식 변환
    return recordDate === selectedDate;
  });

  return (
    <div className="Main_Container">
      <img src="/image/black.png" alt="Background" className="MainImage" />
      <h1 className="maintitle">FitEnd</h1>
      <h2>내 식단 기록</h2>
      {/* 📅 날짜 선택 */}
      <div className="date-selector">
        <label htmlFor="date">날짜 선택: </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={availableDates.size > 0 ? new Date([...availableDates].sort()[0]).toISOString().split("T")[0] : getTodayDate()}
          max={availableDates.size > 0 ? new Date([...availableDates].sort().reverse()[0]).toISOString().split("T")[0] : getTodayDate()}
          list="available-dates"
        />
        <datalist id="available-dates">
          {[...availableDates].map((date) => (
            <option key={date} value={date} />
          ))}
        </datalist>
      </div>

      {/* 📂 식단 기록 리스트 */}
      <div className="food-detail-container">
        {filteredData.length > 0 ? (
          filteredData.map((record, index) => (
            <div key={index} className="diet-record">
              <p>📌 식사: {record.dietMemo || "메모 없음"}</p>
              <p>📅 날짜: {record.timestamp ? new Date(record.timestamp).toLocaleDateString("ko-KR") : "날짜 없음"}</p>
              <p>🍽️ 음식: {record.foodNm || "음식 없음"}</p>
              <p>🔥 칼로리: {record.enerc || 0} kcal</p>
              <p>💪 단백질: {record.prot || 0}g</p>
              <p>🍞 탄수화물: {record.chocdf || 0}g</p>
              <p>🥑 지방: {record.fatce || 0}g</p>
              <p>🏭 제조사: {record.mfrNm || "정보 없음"}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>📭 해당 날짜에 기록이 없습니다.</p>
        )}
      </div>
      
      {/* 하단 네비게이션 버튼 */}
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
