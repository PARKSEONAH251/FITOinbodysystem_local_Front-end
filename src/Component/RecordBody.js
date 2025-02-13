import React, { useState } from "react";

export default function RecordBody() {
  const [userid, setuserid] = useState(sessionStorage.getItem("userid"));
  const [height, setheight] = useState("");
  const [weight, setweight] = useState("");
  const [fatpercentage, setfatpercentage] = useState("");
  const [bmi, setBmi] = useState(null);
  const [inbodyScore, setInbodyScore] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();



    const userInfo = {
      userid,
      height: parseInt(height),
      weight: parseInt(weight),
      fatpercentage: parseFloat(fatpercentage),
    };

    console.log("📌 보내는 데이터:", userInfo); // 디버깅용 로그 추가

    try {
      const response = await fetch("http://localhost:8080/recoduserbody", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const responseData = await response.json();
      console.log("📌 서버 응답 데이터:", responseData); // 서버 응답 데이터 확인

      // 서버에서 받은 BMI, InBody Score를 상태 변수에 저장
      setBmi(responseData.bmi);
      setInbodyScore(responseData.inbodyScore);

    } catch (error) {
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
            value={height}
            onChange={(e) => setheight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>⚖️ Weight (kg):</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setweight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>📉 Fat Percentage (%):</label>
          <input
            type="number"
            step="0.1"
            value={fatpercentage}
            onChange={(e) => setfatpercentage(e.target.value)}
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
          <p><strong>🔥 InBody Score:</strong> {inbodyScore.toFixed(2)}</p>  {/* InBody Score=(100−체지방률)+(몸무게×0.1)*/}
        </div>
      )}
    </div>
  );
}
