import React, { useState, useEffect } from "react";

export default function RankPage() {
  const [maleRank, setMaleRank] = useState([]);
  const [femaleRank, setFemaleRank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 남성 랭킹 조회
    fetch("http://localhost:8080/download/scorerankmale")
      .then((res) => {
        if (!res.ok) {
          throw new Error("서버 응답 오류 (남성 랭킹)");
        }
        return res.json();
      })
      .then((data) => setMaleRank(data))
      .catch((error) => {
        console.error("남성 랭킹 조회 오류:", error);
        setError(error.message);
      });

    // 여성 랭킹 조회
    fetch("http://localhost:8080/download/scorerankfemale")
      .then((res) => {
        if (!res.ok) {
          throw new Error("서버 응답 오류 (여성 랭킹)");
        }
        return res.json();
      })
      .then((data) => setFemaleRank(data))
      .catch((error) => {
        console.error("여성 랭킹 조회 오류:", error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>📡 데이터를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p>⚠️ 오류 발생: {error}</p>;
  }

  return (
    <div>
      <h2>🏆 점수 랭킹</h2>

      <h3>🚹 남성 랭킹</h3>
      {maleRank.length > 0 ? (
        <ul>
          {maleRank.map((item, index) => (
            <li key={index}>
              {index + 1}위 - {item.userId} (점수: {item.score})
            </li>
          ))}
        </ul>
      ) : (
        <p>📉 남성 랭킹 데이터가 없습니다.</p>
      )}

      <h3>🚺 여성 랭킹</h3>
      {femaleRank.length > 0 ? (
        <ul>
          {femaleRank.map((item, index) => (
            <li key={index}>
              {index + 1}위 - {item.userId} (점수: {item.score})
            </li>
          ))}
        </ul>
      ) : (
        <p>📉 여성 랭킹 데이터가 없습니다.</p>
      )}
    </div>
  );
}
