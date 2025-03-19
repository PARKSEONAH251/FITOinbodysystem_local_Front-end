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
  const [randomImages, setRandomImages] = useState([]); // 랜덤 이미지 저장

  // 🐶 강아지 & 🐱 고양이 이미지 리스트 (Imgur에서 직접 이미지 링크 사용)
  const dogImages = [
    "/image/rankimage/bog/KakaoTalk_20250316_002701861_06.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_002701861_09.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_002701861_10.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799_01.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799_02.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799_03.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799_04.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799_05.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799_06.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799_07.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799_08.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799_09.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799_10.jpg",
    "/image/rankimage/bog/KakaoTalk_20250316_003826799.jpg",


    
  ];

  const catImages = [
    "/image/rankimage/KakaoTalk_20250316_002701861_03.jpg",
    "/image/rankimage/KakaoTalk_20250316_002701861_05.jpg",
    "/image/rankimage/KakaoTalk_20250316_002901935_01.jpg",
    "/image/rankimage/KakaoTalk_20250316_002901935_02.jpg",
    "/image/rankimage/KakaoTalk_20250316_002901935_03.jpg",
    "/image/rankimage/KakaoTalk_20250316_002901935_04.jpg",
    "/image/rankimage/KakaoTalk_20250316_002901935_05.jpg",
    "/image/rankimage/KakaoTalk_20250316_002901935.jpg",
    "/image/rankimage/KakaoTalk_20250316_004049803.jpg",
    "/image/rankimage/KakaoTalk_20250316_004146870_02.jpg",
    "/image/rankimage/KakaoTalk_20250316_004146870_03.jpg",
    "/image/rankimage/KakaoTalk_20250316_004146870.jpg",
  ];

  const navigate = useNavigate();
  const navigateMain = () => navigate("/main");
  const navigateToRecordBody = () => navigate("/recodbody");
  const navigateCalender = () => {navigate("/Calender")};
  const navigateGraph = () => navigate("/Graph");

  // 로그아웃 처리
  const handleLogout = async () => {
    await fetch(`http://${config.SERVER_URL}/request/logout`, {
      method: "POST",
      credentials: "include",
    });

    sessionStorage.removeItem("useridRef");
    navigate("/login");
  };

  // 성별 선택 핸들러 (랜덤 이미지 3개 선택)
  const handleGenderSelection = (gender) => {
    setSelectedGender(gender);

    // 선택된 성별에 따라 강아지 or 고양이 이미지에서 3개 랜덤 선택
    const images = gender === "male" ? dogImages : catImages;
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    setRandomImages(shuffled.slice(0, 3));
  };

  // **초기 렌더링 시 성별에 맞는 랜덤 이미지 설정**
  useEffect(() => {
    handleGenderSelection(selectedGender);
  }, [selectedGender]); // selectedGender가 변경될 때마다 실행

  useEffect(() => {
    // 남성 랭킹 조회
    fetch(`http://${config.SERVER_URL}/download/scorerankmale`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("서버 응답 오류 (남성 랭킹)"))
      .then((data) => setMaleRank(data))
      .catch((error) => setError(error));

    // 여성 랭킹 조회
    fetch(`http://${config.SERVER_URL}/download/scorerankfemale`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("서버 응답 오류 (여성 랭킹)"))
      .then((data) => setFemaleRank(data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>📡 데이터를 불러오는 중입니다...</p>;
  if (error) return <p>⚠️ 오류 발생: {error}</p>;

  const rankings = selectedGender === "male" ? maleRank : femaleRank;

  return (
    <div className="Main_Container">
        <a className="RecordBodyTitle">FitEnd</a>
        <img src="/image/backgroundImage/Rectangle23.png" alt="Background" className="MainImage" />
        <img src="/image/backgroundImage/별배경.png" alt="star" className="backgroundstar"/>
        <img src="/image/backgroundImage/프레임4.png" alt="Frame4" className="backgroundFrame4"/>
        <img src="/image/backgroundImage/프레임3.png" alt="Frame3" className="backgroundFrame3"/>
        <img src="/image/backgroundImage/프레임5.png" alt="Frame5" className="backgroundFrame5"/>
        <a className="RecordBodyMainTitle">Ranking</a>
        {/* 🚀 **1~3등의 랜덤 프로필 이미지** */}
        <div className="top-rank-container">
          {[1, 0, 2].map((rank, index) => (
            <div key={rank} className={`rank-profile rank-${rank + 1}`}>
              <img 
                src={(rankings[rank] && rankings[rank].profileImage) ? rankings[rank].profileImage : randomImages[index] || "/image/default_img.jpg"} 
                className="profile-image"
                alt={`Rank ${rank + 1}`}
              />
              <p className="rank-name">{rankings[rank] ? rankings[rank].userid : "Unknown"}</p>
            </div>
          ))}
        </div>


        {/* 🚀 **남자/여자 랭킹 버튼** */}
        <div className="gender-buttons">
          <button 
            className={`gender-btn ${selectedGender === "male" ? "active" : ""}`} 
            onClick={() => handleGenderSelection("male")}
          >
          <a className="genderbtn_title">MAN</a>
          </button>
          <button 
            className={`gender-btn ${selectedGender === "female" ? "active" : ""}`} 
            onClick={() => handleGenderSelection("female")}
          >
          <a className="genderbtn_title">WOMAN</a>
          </button>
        </div>
        <div className="ranking_list" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {rankings.slice(0, 10).map((user, index) => (
            <div key={index} className="ranking-item">
              <span className="rank-position">{index + 1}.</span> &nbsp;&nbsp;
              <span className="user-id">{user.userid}</span>
              <span className="user-score">POINT: {user.score}</span>
            </div>
          ))}
        </div>
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
            <img src="/image/Vector7.png" alt="Graph" className="ButtonImage" onClick={navigateGraph} />
            <span className="Span">Graph</span>
          </div>

          <div className="Button-Item">
            <img src="/image/Vector8.png" alt="Food" className="ButtonImage" onClick={navigateCalender}/>
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
