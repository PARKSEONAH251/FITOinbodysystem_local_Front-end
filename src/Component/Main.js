import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Main() {
  const userid = sessionStorage.getItem("userid");
  const navigate = useNavigate();
  const [bodyrecod, setBodyRecod] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigateToRecordBody = () => {
    navigate("/recordbody");
  };

  const navigateToRank = () => {
    navigate("/rank");
  };
  const navigateToTodo = () => {
    navigate("/todo");
  };
  const handleLogout = () => {
    sessionStorage.removeItem("userid"); // 로그아웃 시 사용자 정보 삭제
    navigate("/login"); // 로그인 페이지로 이동
  };

  useEffect(() => {
    if (!userid) {
      navigate("/login"); // 로그인 안 했으면 로그인 페이지로 강제 이동
      return;
    }

    fetch(`${config.SERVER_URL}/download/recentuserbody/${userid}`)
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
          <h2>Main Screen</h2>
          <p>Welcome to the main screen!</p>
          <p>Logged in as: {userid}</p>

          <div>
            <h2>📊 InBody 결과</h2>
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
            <p>
              <strong>🔥 InBody Score:</strong> {bodyrecod[0].inbodyScore}
            </p>
          </div>

          <button onClick={navigateToRank} style={{ marginLeft: "10px" }}>
            점수 랭킹 보기
          </button>

          <button onClick={navigateToRecordBody}>신체 정보 입력</button>
          <button onClick={navigateToTodo}>음식 다이어리</button>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
            로그아웃
          </button>
        </>
      ) : (
        <p>잘못된 접근</p>
      )}
    </div>
  );
}
