import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import "../Style/graph.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Graph() {
  const userid = sessionStorage.getItem("userid");
  const navigate = useNavigate();
  const [bodyrecod, setBodyRecod] = useState([]);
  const [loading, setLoading] = useState(true);

  // 누적된 BMI 데이터와 오늘의 BMI 상태 관리
  const [bmiData, setBmiData] = useState([]);

  const navigateMain = () => {
    navigate("/main");
  };

  const navigateToRecordBody = () => {
    navigate("/recodbody");
  };

  const navigateToRank = () => {
    navigate("/RankPage");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userid");
    navigate("/login");
  };

  useEffect(() => {
    if (!userid) {
      navigate("/login");
      return;
    }

    fetch(`http://${config.SERVER_URL}/download/recentuserbody/${userid}`)
      .then((response) => response.json())
      .then((data) => {
        setBodyRecod(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, [userid]);

  // 누적된 BMI 데이터와 오늘의 BMI 데이터를 업데이트
  useEffect(() => {
    if (bodyrecod.length > 0) {
      const newBmiData = [
        // 누적된 BMI 데이터를 추가
        { name: 'Day 1', bmi: bodyrecod[0].bmi }, 
        { name: 'Day 2', bmi: bodyrecod[1]?.bmi || bodyrecod[0].bmi }, // 두 번째 데이터가 없으면 첫 번째 데이터로 처리
        { name: 'Day 3', bmi: bodyrecod[2]?.bmi || bodyrecod[0].bmi }, // 마찬가지
        { name: 'Today', bmi: bodyrecod[bodyrecod.length - 1]?.bmi || bodyrecod[0].bmi }, // 오늘의 BMI
      ];
      setBmiData(newBmiData);
    }
  }, [bodyrecod]);

  if (loading) {
    return <p>📡 데이터를 불러오는 중입니다...</p>;
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
            <a className="GraphTitle">FitEnd</a>
            <div className="Central_Menu">
              <div className="Inbodyscore_div">
                <p className="inbodyscore">{bodyrecod[0].inbodyScore}</p>
                <p className="inbodyscore_text"> Your InBody Ranking Score:</p>
                <p className="graphtext">Information</p>
              </div>
              <ResponsiveContainer width={360} height={250}>
                <LineChart data={bmiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bmi" stroke="#C9F439" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="container">
                <div className="item">
                  <img src="/image/height_button.png" alt="Height" className="icon" />
                  <p className="text">{bodyrecod[0].height} cm</p>
                </div>
                <div className="item">
                  <img src="/image/weight_Button.png" alt="Weight" className="icon" />
                  <p className="text">{bodyrecod[0].weight} kg</p>
                </div>
                <div className="item">
                  <img src="/image/PHbutton.png" alt="Body Fat" className="icon" />
                  <p className="text">{bodyrecod[0].fatpercentage} %</p>
                </div>
                <div className="item">
                  <img src="/image/Bmi_button.png" alt="BMI" className="icon" />
                  <p className="text">{bodyrecod[0].bmi}</p>
                </div>
              </div>
              {/* 기타 UI 구성 */}
              <div className="Button-Container">
                <div onClick={navigateMain} className="Button-Item">
                  <img src="/image/HOME.png" alt="Main" className="ButtonImage" />
                  <span className="Span">Main</span>
                </div>

                <div className="Button-Item">
                  <img src="/image/PAPAR.png" alt="Paper" className="ButtonImage" onClick={navigateToRecordBody} />
                  <span className="Span">Paper</span>
                </div>

                <div className="Button-Item">
                  <img src="/image/rankbutton.png" alt="rank" className="ButtonImage" onClick={navigateToRank} />
                  <span className="Span">Ranking</span>
                </div>

                <div className="Button-Item">
                  <img src="/image/Vector8.png" alt="Food" className="ButtonImage" />
                  <span className="Span">Food</span>
                </div>

                <div className="Button-Item">
                  <img src="/image/PEOPLE.png" alt="Logout" className="ButtonImage" onClick={handleLogout} />
                  <span className="Span">Logout</span>
                </div>
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
