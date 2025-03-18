import React, { useState, useEffect } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";
import styles from "../Style/rankpage.module.css";

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
  const navigateFood = () => navigate("/FoodSearchR");
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
    fetch(`http://${config.SERVER_URL}/userinfobody/scorerankmale`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("서버 응답 오류 (남성 랭킹)"))
      .then((data) => setMaleRank(data))
      .catch((error) => setError(error));

    // 여성 랭킹 조회
    fetch(`http://${config.SERVER_URL}/userinfobody/scorerankfemale`, {
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
    <div className={styles.Main_Container}>
        <a className={styles.RecordBodyTitle}>FitEnd</a>
        <img src="/image/backgroundImage/Rectangle23.png" alt="Background" className={styles.MainImage} />
        <img src="/image/backgroundImage/별배경.png" alt="star" className={styles.backgroundstar}/>
        <img src="/image/backgroundImage/프레임4.png" alt="Frame4" className={styles.backgroundFrame4}/>
        <img src="/image/backgroundImage/프레임3.png" alt="Frame3" className={styles.backgroundFrame3}/>
        <img src="/image/backgroundImage/프레임5.png" alt="Frame5" className={styles.backgroundFrame5}/>
        <a className={styles.RecordBodyMainTitle}>     {selectedGender} Ranking </a>
        

         {/* 🚀 **남자/여자 랭킹 버튼** */}
         <div className={styles.gender_buttons}>
          <button 
            className={`styles.gender_btn ${selectedGender === "male" ? "active" : ""}`} 
            onClick={() => handleGenderSelection("male")}
          >
          <a className={styles.genderbtn_title}>male</a>
          </button>
          <button 
            className={`styles.gender_btn ${selectedGender === "female" ? "active" : ""}`} 
            onClick={() => handleGenderSelection("female")}
          >
          <a className={styles.genderbtn_title}>female</a>
          </button>

        </div>
        {/* 🚀 **1~3등의 랜덤 프로필 이미지** */}
        <div className={styles.top_rank_container}>
          {[1, 0, 2].map((rank, index) => (
            <div key={rank} className={`${styles.rank_profile} ${styles[`rank_${rank + 1}`]}`}>
              <img 
                src={(rankings[rank] && rankings[rank].profileImage) ? rankings[rank].profileImage : randomImages[index] || "/image/default_img.jpg"} 
                className={styles.profile_image}
                alt={`Rank ${rank + 1}`}
              />
              <p className={styles.rank_name}>{rankings[rank] ? rankings[rank].userid : "Unknown"}</p>
            </div>
          ))}
        </div>


       
        <div className={styles.ranking_list} style={{ maxHeight: "400px", overflowY: "auto" }}>
          {rankings.slice(0, 10).map((user, index) => {
              // console.log("User Data:", user); // 데이터 확인
              return (
                <div key={index} className={styles.ranking_item}>
                  <span className={styles.rank_position}>{index + 1}.</span> &nbsp;&nbsp;
                  <span className={styles.user_id}>{user.userid}</span>
                  <span className={styles.user_score}>POINT: {user.inbodyScore}</span>
                </div>
              );
            })}
        </div>
        <div className={styles.Button_Container}>
          <div className={styles.Button_Item}>
            <img src="/image/HOME.png" alt="Main" className={styles.ButtonImage} onClick={navigateMain} />
            <span className={styles.span}>Main</span>         
          </div>

          <div className={styles.Button_Item}>
            <img src="/image/PAPAR.png" alt="Paper" className={styles.ButtonImage} onClick={navigateToRecordBody} />
            <span className={styles.span}>Paper</span>
          </div>

          <div className={styles.Button_Item}>
            <img src="/image/Vector7.png" alt="Graph" className={styles.ButtonImage} onClick={navigateGraph} />
            <span className={styles.span}>Graph</span>
          </div>

          <div className={styles.Button_Item}>
            <img src="/image/Vector8.png" alt="Food" className={styles.ButtonImage} onClick={navigateFood}/>
            <span className={styles.span}>Food</span>
          </div>

          <div className={styles.Button_Item}>
            <img src="/image/PEOPLE.png" alt="Logout" className={styles.ButtonImage} onClick={handleLogout} />
            <span className={styles.span}>Logout</span>
          </div>
        </div>
    </div>
  );
}