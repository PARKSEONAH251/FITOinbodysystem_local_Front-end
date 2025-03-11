import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

import "../Style/graph.css";
export default function Graph() {
  const userid = sessionStorage.getItem("userid");
  const navigate = useNavigate();
  const [bodyrecod, setBodyRecod] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
    if (!userid) {
      navigate("/login"); // 로그인 안 했으면 로그인 페이지로 강제 이동
      return;
    }

    fetch(`http://${config.SERVER_URL}/download/recentuserbody/${userid}`)
      .then((response) => response.json())
      .then((data) => {
        setBodyRecod(data);
        setLoading(false); // 데이터 로드 완료 후 로딩 상태 업데이트
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false); // 에러 발생 시에도 로딩 상태 업데이트
      });
  }, [userid]);

  console.log(bodyrecod, "여기여");

  if (loading) {
    return <p>📡 데이터를 불러오는 중입니다...</p>; // 로딩 중 메시지 유지
  }

  if (bodyrecod.length === 0 || bodyrecod[0] == null) {
    return (
      <div>
        <p>⚠️ 신체 기록이 없습니다. 데이터를 입력해주세요.</p>
        <button onClick={navigateToRecordBody}>기록 추가하기</button>
      </div>
    );
  }

  return (
    <div>
      {userid ? (
        <>
          <div className="Graph_Container">
          <img src="/image/black.png" alt="Background" className="MainImage" />
            <div className="Graph_harder"> 
              <p>Welcome to Your Information</p>
              <p>{userid}</p>
            </div>
            <div className="Inbodyscore_div">
              <p className="inbodyscore">{bodyrecod[0].inbodyScore}</p>
              <p className="inbodyscore_text"> Your InBody Score:</p>
            </div>
            <div>
              <p>
                <strong>📏 키:</strong> {bodyrecod[0].height} cm
              </p>
              <p>
                <strong>⚖️ 몸무게:</strong> {bodyrecod[0].weight} kg
              </p>
              <p>
                <strong>📉 체지방률:</strong> {bodyrecod[0].fatpercentage} %
              </p>
              <p>
                <strong>💪 BMI:</strong> {bodyrecod[0].bmi}
              </p>
              
            </div>
            <div className="button-container">
              <div  onClick={navigateMain} className="button-item">
                <img src="/image/HOME.png" alt="Main" className="buttonimage" />
                <span className="span">Main</span> {/* 이미지 아래에 텍스트 추가 */}
              </div>

              <div className="button-item">
                <img src="/image/PAPAR.png" alt="Paper" className="buttonimage" onClick={navigateToRecordBody} />
                <span className="span">Paper</span> {/* 이미지 아래에 텍스트 추가 */}
              </div>

              <div className="button-item">
                <img src="/image/Vector7.png" alt="Graph" className="buttonimage" onClick={navigateGraph} />
                <span className="span">Graph</span> {/* 이미지 아래에 텍스트 추가 */}
              </div>

              <div className="button-item">
                <img src="/image/Vector8.png" alt="Food" className="buttonimage" />
                <span className="span">Food</span> {/* 이미지 아래에 텍스트 추가 */}
              </div>

              <div className="button-item">
                <img src="/image/PEOPLE.png" alt="Logout" className="buttonimage" onClick={handleLogout} />
                <span className="span">Logout</span> {/* 이미지 아래에 텍스트 추가 */}
              </div>
            </div>
          </div>
          
        </>
      ) : (
        <p>잘못된 접근</p>
      )}
    </div>
  );
}
