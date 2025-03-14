import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function TodoCalender() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [userid, setUserid] = useState("");

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

        // 식단 기록 가져오기
        return fetch(`http://${config.SERVER_URL}/request/diet-records/${data.userid}`, {
          method: "GET",
          credentials: "include", // 쿠키 포함 요청
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error("서버 응답이 실패했습니다.");
        return response.json();
      })
      .then((data) => {
        console.log("받은 데이터:", data);
        setUserData(data);
      })
      .catch((error) => {
        console.warn("인증 실패 또는 데이터 불러오기 실패:", error);
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div>
      <h2>내 식단 기록</h2>

      {userData.length > 0 ? (
        userData.map((record, index) => (
          <div key={index}>
            <p>메모: {record.dietMemo || "메모 없음"}</p>
            <p>날짜: {record.timestamp ? new Date(record.timestamp).toLocaleDateString("ko-KR") : "날짜 없음"}</p>
            <p>음식: {record.foodNm || "음식 없음"}</p>
            <p>칼로리: {record.enerc || 0} kcal</p>
            <p>단백질: {record.prot || 0}g</p>
            <p>탄수화물: {record.chocdf || 0}g</p>
            <p>지방: {record.fatce || 0}g</p>
            <p>제조사: {record.mfrNm || "정보 없음"}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>기록이 없습니다.</p>
      )}

      <button onClick={() => navigate("/food")}>음식 검색</button>
    </div>
  );
}