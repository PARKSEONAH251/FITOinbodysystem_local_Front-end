import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../config";
import "../Style/FoodList.css";

export default function FoodSearchR() {
  const [data, setData] = useState(null);
  const [foodNm, setFoodNm] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // 날짜 선택
  // const [dietMemo, setDietMemo] = useState(""); // 메모 입력
  const [userid, setUserid] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { date, mealType } = location.state || {}; // state에서 date와 mealType 가져오기

  const navigateMain = () => {navigate("/main");};
  const navigateToRecordBody = () => {navigate("/recodbody");};
  const navigateFood=() => {navigate("/MealTimingselect");};
  const navigateGraph = () => {navigate("/Graph")};

  // 로그아웃 처리
  const handleLogout = async () => {
    await fetch(`http://${config.SERVER_URL}/request/logout`, {
      method: "POST",
      credentials: "include",
    });

    sessionStorage.removeItem("useridRef");
    navigate("/login");
  };

  // 쿠키에 JWT 존재 여부만 확인함
  const getCookie = (name) => {
    const cookieArr = document.cookie.split("; ");
    for (let i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].split("=");
      if (cookiePair[0] === name) {
        return cookiePair[1];
      }
    }
    return null;
  };

  useEffect(() => {
    // 서버에서 현재 로그인한 사용자 확인
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
      })
      .catch(() => {
        console.warn("인증 실패. 로그인 페이지로 이동");
        navigate("/login");
      });
  }, [navigate]);

  // 음식 검색 API 호출
  const fetchData = () => {
    if (foodNm) {
      fetch(`http://${config.SERVER_URL}/request/foodname/${foodNm}`, {
        method: "GET",
        credentials: "include", // 쿠키 포함 요청
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
    console.log(data);
  };

  // 음식 선택 후 저장 API 호출
  const handleButtonClick = (item) => {
    // if (!selectedDate) {
    //   alert("날짜를 선택하세요!");
    //   return;
    // }

    const foodData = {
      ...item,
      userid,
      timestamp: date || new Date().toISOString(), // 선택한 날짜가 없으면 현재 날짜
      dietMemo: mealType || "기록 없음", // 메모 기본값 설정
    };

    console.log("전송할 데이터:", foodData); // 전송 전에 확인

    fetch(`http://${config.SERVER_URL}/request/saveFoodRecord`, {
      method: "POST",
      credentials: "include", // 쿠키 포함 요청
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foodData),
    })
      .then((response) => response.text()) // JSON 형식이 아니라면 .json() 대신 .text() 사용
      .then((data) => {
        console.log("서버 응답:", data);
        alert(data); // 성공 메시지 출력
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="Main_Container">
      <img src="/image/black.png" alt="Background" className="MainImage" />
        <a className="maintitle">FitEnd</a>
        <div className="food-container">
      {/* <h2>날짜 선택</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <h2>메모 입력</h2>
      <input
        type="text"
        placeholder="메모 입력"
        value={dietMemo}
        onChange={(e) => setDietMemo(e.target.value)}
      /> */}
<h2>날짜: {date}</h2>
<h2>식사 유형: {mealType === "breakfast" ? "아침" : mealType === "lunch" ? "점심" : "저녁"}</h2>
      <h2>음식 검색</h2>
      <input
        type="text"
        value={foodNm}
        onChange={(e) => setFoodNm(e.target.value)}
        placeholder="Enter food name"
      />
      <button onClick={fetchData}>Search</button>
      {data ? (
        <div>
          {data.map((item, index) => (
            <button key={index} onClick={() => handleButtonClick(item)}>
              {item.foodNm} {item.mfrNm}
            </button>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}

  <button onClick={() => navigate("/todo")}>FoodList</button>

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
</div>
  );
}
