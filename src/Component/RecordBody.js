import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function RecordBody() {
  const navigate = useNavigate();
  const [userid, setUserid] = useState("");

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fatpercentage, setFatPercentage] = useState("");

  const navigateMain = () => {navigate("/main");};
  const navigateToRecordBody = () => {navigate("/recodbody");};
  const navigateFood=() => {navigate("/FoodList");};
  const navigateGraph = () => {navigate("/Graph")};
  const navigateRank = () => {navigate("/rank");};
  const handleLogout = async () => {
    await fetch(`http://${config.SERVER_URL}/login/logout`, {
      method: "POST",
      credentials: "include",
    });
  };

  useEffect(() => {
    // 현재 로그인된 유저 확인
    fetch(`http://${config.SERVER_URL}/login/validate`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unauthorized");
        return response.json();
      })
      .then((data) => {
        console.log("로그인 확인 성공:", data);
        setUserid(data.userid);
      })
      .catch(() => {
        console.warn("인증 실패. 로그인 페이지로 이동");
        navigate("/login");
      });
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userBodyInfo = {
      userid,
      height: parseFloat(height),
      weight: parseFloat(weight),
      fatpercentage: parseFloat(fatpercentage),
    };

    console.log("📌 보내는 데이터:", userBodyInfo);

    try {
      const response = await fetch(`http://${config.SERVER_URL}/userinfobody/recorduserbody`, {
        method: "POST",
        credentials: "include", // 쿠키 포함 요청
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userBodyInfo),
      });

      if (response.ok) {
        alert("신체 정보가 저장되었습니다! 메인 페이지로 이동합니다.");
        navigate("/graph");
      } else {
        alert("신체 정보 저장 실패! 다시 시도해주세요.");
      }
    } catch (error) {
      alert("서버 오류 발생! 관리자에게 문의하세요.");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>📊 Record Body</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>📏 Height (cm):</label>
          <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} required />
        </div>
        <div>
          <label>⚖️ Weight (kg):</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        </div>
        <div>
          <label>📉 Fat Percentage (%):</label>
          <input type="number" step="0.1" value={fatpercentage} onChange={(e) => setFatPercentage(e.target.value)} required />
        </div>
        <button type="submit" onClick={navigateGraph}>✅ Submit</button>
      </form>
    </div>
  );
}