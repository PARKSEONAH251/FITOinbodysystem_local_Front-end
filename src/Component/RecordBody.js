import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecordBody() {
  const [userid, setuserid] = useState(sessionStorage.getItem("userid"));
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fatpercentage, setFatPercentage] = useState("");
  const [bmi, setBmi] = useState(null);
  const [inbodyScore, setInbodyScore] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userInfo = {
      userid,
      height: parseFloat(height),
      weight: parseFloat(weight),
      fatpercentage: parseFloat(fatpercentage),
    };

    console.log("📌 보내는 데이터:", userInfo);

    try {
      const response = await fetch("http://localhost:8080/upload/recorduserbody", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("📌 서버 응답 데이터:", responseData); // 서버 응답 데이터 확인

        setBmi(responseData.bmi);
        setInbodyScore(responseData.inbodyScore);

        alert("신체 정보가 저장되었습니다! 메인 페이지로 이동합니다.");
        navigate("/main");
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
          <input
            type="number"
            step="0.1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>⚖️ Weight (kg):</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>📉 Fat Percentage (%):</label>
          <input
            type="number"
            step="0.1"
            value={fatpercentage}
            onChange={(e) => setFatPercentage(e.target.value)}
            required
          />
        </div>
        <button type="submit">✅ Submit</button>
      </form>

      {/* 사용자가 입력한 정보 및 결과 출력 */}
      {bmi !== null && inbodyScore !== null && (
        <div>
          <h2>📊 InBody 결과</h2>
          <p><strong>📏 키:</strong> {height} cm</p>
          <p><strong>⚖️ 몸무게:</strong> {weight} kg</p>
          <p><strong>📉 체지방률 :</strong> {fatpercentage} %</p>
          <p><strong>💪 BMI:</strong> {bmi.toFixed(2)}</p>
          <p><strong>🔥 InBody Score:</strong> {inbodyScore.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
