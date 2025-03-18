import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import styles from "../Style/graph.module.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Graph() {
  const useridRef = useRef(sessionStorage.getItem("userid"));
  const navigate = useNavigate();
  const [bodyrecod, setBodyRecod] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bmiData, setBmiData] = useState([]);

  const navigateMain = () => navigate("/main");
  const navigateToRecordBody = () => navigate("/recodbody");
  const navigateFood = () => navigate("/MealTimingselect");
  const navigateRank = () => navigate("/rank");
  
  const handleLogout = async () => {
    await fetch(`http://${config.SERVER_URL}/login/logout`, {
      method: "POST",
      credentials: "include",
    });
    sessionStorage.removeItem("userid");
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
        useridRef.current = data.userid;
        sessionStorage.setItem("userid", data.userid);
        return fetch(`http://${config.SERVER_URL}/userinfobody/recentuserbody/${data.userid}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
      })
      .then((response) => response.json())
      .then((bodyData) => {
        setBodyRecod(bodyData);
        setLoading(false);
      })
      .catch(() => {
        sessionStorage.removeItem("userid");
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (bodyrecod.length > 0) {
      const newBmiData = [
        { name: 'Day 1', bmi: bodyrecod[0].bmi }, 
        { name: 'Day 2', bmi: bodyrecod[1]?.bmi || bodyrecod[0].bmi },
        { name: 'Day 3', bmi: bodyrecod[2]?.bmi || bodyrecod[0].bmi },
        { name: 'Today', bmi: bodyrecod[bodyrecod.length - 1]?.bmi || bodyrecod[0].bmi },
      ];
      setBmiData(newBmiData);
    }
  }, [bodyrecod]);

  if (loading) return <p>📡 데이터를 불러오는 중입니다...</p>;
  if (bodyrecod.length === 0 || bodyrecod[0] == null) {
    return (
      <div className={styles.noDataContainer}>
        <p>⚠️ 신체 기록이 없습니다. 데이터를 입력해주세요.</p>
        <button onClick={navigateToRecordBody} className={styles.recordButton}>기록 추가하기</button>
      </div>
    );
  }

  return (
    <div className={styles.Graph_Container}>
      <img src="/image/black.png" alt="Background" className={styles.MainImage} />
      <a className={styles.GraphTitle}>FitEnd</a>

      <div className={styles.Central_Menu}>
        <div className={styles.Inbodyscore_div}>
          <p className={styles.inbodyscore}>{bodyrecod[0].inbodyScore}</p>
          <p className={styles.inbodyscore_text}>Your InBody Ranking Score:</p>
          <p className={styles.graphtext}>Information</p>
        </div>

        <ResponsiveContainer width={360} height={250}>
          <LineChart data={bmiData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bmi" stroke="#C9F439" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        <div className={styles.container}>
          <div className={styles.item}>
            <img src="/image/height_button.png" alt="Height" className={styles.icon} />
            <p className={styles.text}>{bodyrecod[0].height} cm</p>
          </div>
          <div className={styles.item}>
            <img src="/image/weight_Button.png" alt="Weight" className={styles.icon} />
            <p className={styles.text}>{bodyrecod[0].weight} kg</p>
          </div>
          <div className={styles.item}>
            <img src="/image/PHbutton.png" alt="Body Fat" className={styles.icon} />
            <p className={styles.text}>{bodyrecod[0].fatpercentage} %</p>
          </div>
          <div className={styles.item}>
            <img src="/image/Bmi_button.png" alt="BMI" className={styles.icon} />
            <p className={styles.text}>{bodyrecod[0].bmi}</p>
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className={styles.Button_Container}>
          {[ 
            { img: "HOME.png", alt: "Main", action: navigateMain, label: "Main" },
            { img: "PAPAR.png", alt: "Paper", action: navigateToRecordBody, label: "Paper" },
            { img: "Vector7.png", alt: "Rank", action: navigateRank, label: "Rank" },
            { img: "Vector8.png", alt: "Food", action: navigateFood, label: "Food" },
            { img: "PEOPLE.png", alt: "Logout", action: handleLogout, label: "Logout" },
          ].map(({ img, alt, action, label }, idx) => (
            <div key={idx} className={styles.Button_Item}>
              <img src={`/image/${img}`} alt={alt} className={styles.ButtonImage} onClick={action} />
              <span className={styles.Span}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
