import React, { useState, useEffect } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";
import "../Style/rankpage.css";

export default function RankPage() {
  const [maleRank, setMaleRank] = useState([]);
  const [femaleRank, setFemaleRank] = useState([]);
  const [selectedGender, setSelectedGender] = useState("male"); // 기본값: 남성 랭킹
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const navigateMain = () => {
    navigate("/main");
  }

  const navigateToRecordBody = () => {
    navigate("/recodbody");
  };

  const navigateGraph = () => {
    navigate("/Graph")
  }

  const handleLogout = () => {
    sessionStorage.removeItem("userid"); // 로그아웃 시 사용자 정보 삭제
    navigate("/login"); // 로그인 페이지로 이동
  };

  useEffect(() => {
    fetch(`http://${config.SERVER_URL}/download/scorerankmale`)
      .then((res) => res.ok ? res.json() : Promise.reject("남성 랭킹 오류"))
      .then(setMaleRank)
      .catch(setError);

    fetch(`http://${config.SERVER_URL}/download/scorerankfemale`)
      .then((res) => res.ok ? res.json() : Promise.reject("여성 랭킹 오류"))
      .then(setFemaleRank)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>📡 데이터를 불러오는 중입니다...</p>;
  if (error) return <p>⚠️ 오류 발생: {error}</p>;

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
          <img src="/image/Vector8.png" alt="Food" className="ButtonImage" />
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