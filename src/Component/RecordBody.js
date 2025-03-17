import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import "../Style/recordbody.css"
export default function RecordBody() {
  const navigate = useNavigate();
  const [userid, setUserid] = useState("");
  const [selectedSex, setSelectedSex] = useState(null);
  const [jwtString, setJwtString] = useState(""); // JWT 문자열을 위한 상태 추가
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fatpercentage, setFatPercentage] = useState("");
  const useridRef = useRef(sessionStorage.getItem("userid"));
  //RADIO버튼 이벤트 처리
  const handleSexChange = (event) => {
    setSelectedSex(event.target.value);
  }

  const navigateMain = () => {navigate("/main");};
  const navigateToRecordBody = () => {navigate("/recodbody");};
  const navigateFood=() => {navigate("/FoodSearchR");};
  const navigateGraph = () => {navigate("/Graph")};

  // 로그아웃 처리
  const handleLogout = async () => {
    await fetch(`http://${config.SERVER_URL}/request/logout`, {
      method: "POST",
      credentials: "include",
    });

    sessionStorage.removeItem("useridRef");
    navigate("/login");
  };

  const generationJwt = async () => {
    try {
      const response = await fetch(
        `http://${config.SERVER_URL}/userinfo/generation`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userid: sessionStorage.getItem("userid") }),
        }
        // , console.log("useridRef.current:", sessionStorage.getItem("userid"))
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // JWT 문자열을 받습니다. 서버가 Content-Type을 'text/plain'으로 설정했다고 가정합니다.
      const jwtString = await response.text();
      setJwtString(jwtString); // 상태 업데이트

      console.log("genetate 받은 JWT:", jwtString);
      // 이제 jwtString 변수를 사용하여 필요한 작업을 수행할 수 있습니다.
    } catch (error) {
      console.error("JWT 생성 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    fetch(`http://${config.SERVER_URL}/login/validate`, {
      method: "GET",
      credentials: "include", // 쿠키 자동 포함
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unauthorized");
        return response.json();
      })
      .then((data) => {
        console.log("로그인 상태 확인 성공:", data);
        useridRef.current = data.useridRef;
        sessionStorage.setItem("userid", data.userid);
        const init = async () => {
          await generationJwt();
        };
        init();
      })
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
      const response = await fetch(`http://${config.SERVER_URL}/upload/recorduserbody`, {
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
    <div className="RecordBody_Container">
      <img
        src={selectedSex === "1" ? "/image/man.png" : "/image/woman.png"}
        alt="backgroundimage"
        className="RecordBodyImage"
      />
      <img src="/image/Rectangle22.png" alt="backgroudvector" className="RecordBodyvector"></img>
      <a className="RecordBodyTitle">FitEnd</a>
      <h2 className="RecordBody_Title">{selectedSex === "1" ? "MAN BMI INPUT" : selectedSex === "2" ? "WONMAN BMI INPUT" : "Please select your gender"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="gender">
            <label>
              <input type="radio" name="sex" value="1" onChange={handleSexChange}/>
            </label>
            <label className="Radio_button_Man">MAN</label>
            <label>
              <input type="radio" name="sex" value="2" onChange={handleSexChange}/>
            </label>
            <label className="Radio_button_Woman">WOMAN</label>
          </div>
            <label className="Height">Height (cm)</label>
            <input className="input_text" type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} required />
            <label className="Weight">Weight (kg)</label>
            <input className="input_text" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} required />
            <label className="Fat">Fat Percentage (%)</label>
            <input className="input_text" type="number" step="0.1" value={fatpercentage} onChange={(e) => setFatPercentage(e.target.value)} required />
          </div>
          <button className="RecordBody_Submit_Button" type="submit" onClick={navigateGraph}>Submit</button>
      </form>
      <div className="Button-Container">
          <div className="Button-Item">
            <img src="/image/HOME.png" alt="Main" className="ButtonImage" onClick={navigateMain} />
            <span className="Span">Main</span>
          </div>

          <div className="Button-Item">
            <img src="/image/PAPAR.png" alt="Paper" className="ButtonImage" onClick={navigateToRecordBody} />
            <span className="Span">Paper</span>
          </div>

          <div className="Button-Item">
            <img src="/image/Vector7.png" alt="rank" className="ButtonImage" onClick={navigateGraph} />
            <span className="Span">Graph</span>
          </div>

          <div className="Button-Item">
            <img src="/image/Vector8.png" alt="Food" className="ButtonImage" onClick={navigateFood}/>
            <span className="Span">Food</span>
          </div>

          <div className="Button-Item">
            <img src="/image/PEOPLE.png" alt="Logout" className="ButtonImage" onClick={handleLogout} />
            <span className="Span">Logout</span>
          </div>
        </div>
    </div>
  );
}