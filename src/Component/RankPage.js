// import React, { useState, useEffect } from "react";
// import config from "../config";
// import { useNavigate } from "react-router-dom";
// import '../css/rankpage.css'

// export default function RankPage() {
//   const [maleRank, setMaleRank] = useState([]);
//   const [femaleRank, setFemaleRank] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const navigateMain = () => {
//     navigate("/main");
//   }

//   const navigateToRecordBody = () => {
//     navigate("/recodbody");
//   };

//   const navigateGraph = () => {
//     navigate("/Graph")
//   }

//   const navigateToRank = () => {
//     navigate("/rank");
//   };

//   const handleLogout = () => {
//     sessionStorage.removeItem("userid"); // 로그아웃 시 사용자 정보 삭제
//     navigate("/login"); // 로그인 페이지로 이동
//   };

//   useEffect(() => {
//     // 남성 랭킹 조회
//     fetch(`http://${config.SERVER_URL}/download/scorerankmale`)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("서버 응답 오류 (남성 랭킹)");
//         }
//         return res.json();
//       })
//       .then((data) => setMaleRank(data))
//       .catch((error) => {
//         console.error("남성 랭킹 조회 오류:", error);
//         setError(error.message);
//       });
//     // 여성 랭킹 조회
//     fetch(`http://${config.SERVER_URL}/download/scorerankfemale`)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("서버 응답 오류 (여성 랭킹)");
//         }
//         return res.json();
//       })
//       .then((data) => setFemaleRank(data))
//       .catch((error) => {
//         console.error("여성 랭킹 조회 오류:", error);
//         setError(error.message);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return <p>📡 데이터를 불러오는 중입니다...</p>;
//   }

//   if (error) {
//     return <p>⚠️ 오류 발생: {error}</p>;
//   }

//   // console.log(maleRank, "여긴남자");

//   // console.log(femaleRank, "여긴 여자");

//   return (
//     <div className="Main_Container">
//       <h2 className="maintitle">fit-end</h2>

//       <img src="/image/black.png" alt="Background" className="MainImage"/>

//       <h2 className="title">RANKING</h2>
//       <h3 className="ranklist">🚹 남성 랭킹</h3>
//       {maleRank.length > 0 ? (
//         <ul className="ranklist">
//           {maleRank.map((item, index) => (
//             <li key={index}>
//               {index + 1}위 - {item.userid} (점수: {item.score})
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>📉 남성 랭킹 데이터가 없습니다.</p>
//       )}

//       <h3 className="ranklist">🚺 여성 랭킹</h3>
//       {femaleRank.length > 0 ? (
//         <ul className="ranklist">
//           {femaleRank.map((item, index) => (
//             <li key={index}>
//               {index + 1}위 - {item.userid} (점수: {item.score})
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>📉 여성 랭킹 데이터가 없습니다.</p>
//       )}
//       <div className="button-container">
//         <div className="button-item">
//           <img src="/image/HOME.png" alt="Main" className="buttonimage" onClick={navigateMain} />
//           <span className="span">Main</span> {/* 이미지 아래에 텍스트 추가 */}
//         </div>

//         <div className="button-item">
//           <img src="/image/PAPAR.png" alt="Paper" className="buttonimage" onClick={navigateToRecordBody} />
//           <span className="span">Paper</span> {/* 이미지 아래에 텍스트 추가 */}
//         </div>

//         <div className="button-item">
//           <img src="/image/Vector7.png" alt="Graph" className="buttonimage" onClick={navigateToRank} />
//           <span className="span">Graph</span> {/* 이미지 아래에 텍스트 추가 */}
//         </div>

//         <div className="button-item">
//           <img src="/image/Vector8.png" alt="Food" className="buttonimage" />
//           <span className="span">Food</span> {/* 이미지 아래에 텍스트 추가 */}
//         </div>

//         <div className="button-item">
//           <img src="/image/PEOPLE.png" alt="Logout" className="buttonimage" onClick={handleLogout} />
//           <span className="span">Logout</span> {/* 이미지 아래에 텍스트 추가 */}
//         </div>
//         </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";
import "../css/rankpage.css";

export default function RankPage() {
  const [maleRank, setMaleRank] = useState([]);
  const [femaleRank, setFemaleRank] = useState([]);
  const [selectedGender, setSelectedGender] = useState("male"); // 기본값: 남성 랭킹
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      <div className="title-container">
        <h2 className="title">RANKING</h2>
        <div className="gender-buttons">
          <button 
            className={`gender-btn ${selectedGender === "male" ? "active" : ""}`} 
            onClick={() => setSelectedGender("male")}
          >
            🚹 남자
          </button>
          <button 
            className={`gender-btn ${selectedGender === "female" ? "active" : ""}`} 
            onClick={() => setSelectedGender("female")}
          >
            🚺 여자
          </button>
        </div>
      </div>

      <div className="top-rank-container">
        {/* 2등 - 왼쪽 */}
        {rankings[1] && (
          <div className="rank-profile rank-2">
            <img 
              src={rankings[1].profileImage || "/image/default_img.jpg"} 
              alt={`${rankings[1].userid} 프로필`} 
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
              alt={`${rankings[0].userid} 프로필`} 
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
              alt={`${rankings[2].userid} 프로필`} 
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
              alt={`${user.userid} 프로필`} 
              className="profile-small"
            />
            <span className="user-id">{user.userid}</span>
            <span className="user-score">점수: {user.score}</span>
          </div>
        ))}
      </div>

      <div className="button-container">
        <div className="button-item" onClick={() => navigate("/main")}>
          <img src="/image/HOME.png" alt="Main" className="buttonimage" />
          <span>Main</span>
        </div>
        <div className="button-item" onClick={() => navigate("/RecordBody")}>
          <img src="/image/PAPAR.png" alt="Paper" className="buttonimage" />
          <span>Paper</span>
        </div>
        <div className="button-item" onClick={() => navigate("/rank")}>
          <img src="/image/Vector7.png" alt="Graph" className="buttonimage" />
          <span>Graph</span>
        </div>
        <div className="button-item" onClick={() => navigate("/food")}>
          <img src="/image/Vector8.png" alt="Food" className="buttonimage" />
          <span>Food</span>
        </div>
        <div className="button-item" onClick={() => navigate("/login")}>
          <img src="/image/PEOPLE.png" alt="Logout" className="buttonimage" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
