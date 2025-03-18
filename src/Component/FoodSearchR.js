import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../config";
import styles from "../Style/FoodList.module.css";

export default function FoodSearchR() {
  const [data, setData] = useState(null);
  const [foodNm, setFoodNm] = useState("");
  const [userid, setUserid] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { date, mealType } = location.state || {};

  const navigateMain = () => navigate("/main");
  const navigateToRecordBody = () => navigate("/recodbody");
  const navigateFood = () => navigate("/MealTimingselect");
  const navigateGraph = () => navigate("/Graph");

  const handleLogout = async () => {
    await fetch(`http://${config.SERVER_URL}/login/logout`, {
      method: "POST",
      credentials: "include",
    });

    sessionStorage.removeItem("useridRef");
    navigate("/login");
  };

  useEffect(() => {
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
      })
      .catch(() => {
        console.warn("인증 실패. 로그인 페이지로 이동");
        navigate("/login");
      });
  }, [navigate]);

  const fetchData = () => {
    if (foodNm) {
      fetch(`http://${config.SERVER_URL}/food/foodname/${foodNm}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  };

  const handleButtonClick = (item) => {
    const foodData = {
      ...item,
      userid,
      timestamp: date || new Date().toISOString(),
      dietMemo: mealType || "기록 없음",
    };

    console.log("전송할 데이터:", foodData);

    fetch(`http://${config.SERVER_URL}/food/saveFoodRecord`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foodData),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("서버 응답:", data);
        alert(data);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className={styles.Main_Container}>
      <img src="/image/black.png" alt="Background" className={styles.MainImage} />
      <a className={styles.maintitle}>FitEnd</a>

      <div className={styles.food_container}>
        <h2>날짜: {date}</h2>
        <h2>식사 유형: {mealType === "breakfast" ? "아침" : mealType === "Lunch" ? "점심" : "저녁"}</h2>

        <h2>음식 검색</h2>
        <input
          type="text"
          value={foodNm}
          onChange={(e) => setFoodNm(e.target.value)}
          placeholder="Enter food name"
          className={styles.searchInput}
        />
        <button onClick={fetchData} className={styles.searchButton}>Search</button>

        {data ? (
          <div className={styles.foodList}>
            {data.map((item, index) => (
              <button key={index} onClick={() => handleButtonClick(item)} className={styles.foodItem}>
                {item.foodNm} {item.mfrNm}
              </button>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}

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
              <img src="/image/Vector7.png" alt="Graph" className={styles.buttonImage} onClick={navigateGraph} />
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
    </div>
  );
}
