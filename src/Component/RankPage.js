import React, { useState, useEffect } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";
import "../Style/rankpage.css";


export default function RankPage() {
  const [maleRank, setMaleRank] = useState([]);
  const [femaleRank, setFemaleRank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGender, setSelectedGender] = useState("male"); // 기본값: 남성 랭킹

  const navigate = useNavigate();
  const navigateMain = () => {navigate("/main");};
  const navigateToRecordBody = () => {navigate("/recodbody");};
  const navigateFood=() => {navigate("/FoodSearchR");};
  const navigateGraph = () => {navigate("/Graph")};

  // 로그아웃 처리
  const handleLogout = async () => {
    await fetch(`http://${config.SERVER_URL}/request/logout`, {
      method: "POST",
      credentials: "include",
    });}

  useEffect(() => {
    // 남성 랭킹 조회
    fetch(`http://${config.SERVER_URL}/download/scorerankmale`, {
      method: "GET",
      credentials: "include", // 쿠키 포함 요청
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("서버 응답 오류 (남성 랭킹)");
        }
        return res.json();
      })
      .then((data) => setMaleRank(data))
      .catch((error) => {
        console.error("남성 랭킹 조회 오류:", error);
        setError(error.message);
      });

    // 여성 랭킹 조회
    fetch(`http://${config.SERVER_URL}/download/scorerankfemale`, {
      method: "GET",
      credentials: "include", // 쿠키 포함 요청
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 오류 (여성 랭킹)");
        return res.json();
      })
      .then((data) => setFemaleRank(data))
      .catch((error) => {
        console.error("여성 랭킹 조회 오류:", error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>📡 데이터를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p>⚠️ 오류 발생: {error}</p>;
  }

  const rankings = selectedGender === "male" ? maleRank : femaleRank;

  return (
    <div className="Main_Container">
        <h2 className="maintitle" >FitEnd</h2>
        <img src="/image/black.png" alt="Background" className="MainImage" />
        <div className="title-container">
        <h2 className="title">RANKING</h2>
        <div className="gender-buttons">
          <button 
            className={`gender-btn ${selectedGender === "male" ? "active" : ""}`} 
            onClick={() => setSelectedGender("male")}
          >
            MAN
          </button>
          <button 
            className={`gender-btn ${selectedGender === "female" ? "active" : ""}`} 
            onClick={() => setSelectedGender("female")}
          >
            WOMAN
          </button>
        </div>
      </div>

      <div className="top-rank-container">
        {/* 2등 - 왼쪽 */}
        {rankings[1] && (
          <div className="rank-profile rank-2">
            <img 
              src={rankings[1].profileImage || "/image/default_img.jpg"} 
              className="profile-image"
            />
            <p className="rank-name">{rankings[1].userid}</p>
          </div>
        )}

        {/* 1등 - 중앙 */}
        {rankings[0] && (
          <div className="rank-profile rank-1">
            <img 
              src={rankings[0].profileImage || "/image/default_img.jpg"} 
              className="profile-image"
            />
            <p className="rank-name">{rankings[0].userid}</p>
          </div>
        )}

        {/* 3등 - 오른쪽 */}
        {rankings[2] && (
          <div className="rank-profile rank-3">
            <img 
              src={rankings[2].profileImage || "/image/default_img.jpg"} 
              className="profile-image"
            />
            <p className="rank-name">{rankings[2].userid}</p>
          </div>
        )}
      </div>



      <div className="ranking-list">
        {rankings.slice(0, 10).map((user, index) => (
          <div key={index} className="ranking-item">            
            <span className="rank-position">{index + 1}.</span> &nbsp;&nbsp;
            <img 
              src={user.profileImage || "/image/default_img.jpg"} 
              className="profile-small"
            />
            <span className="user-id">{user.userid}</span>
            <span className="user-score">점수: {user.score}</span>
          </div>
        ))}
      </div>

      <div className="Button-Container">
        <div onClick={navigateMain} className="Button-Item">
          <img src="/image/HOME.png" alt="Main" className="ButtonImage" />
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