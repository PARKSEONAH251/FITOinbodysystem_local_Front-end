import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { useSpring, animated } from "react-spring";
import { useSwipeable } from "react-swipeable"; // For touch/swipe functionality
import "../Style/main.css";

export default function Main() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jwtString, setJwtString] = useState(""); // JWT 문자열을 위한 상태 추가
  const useridRef = useRef(sessionStorage.getItem("userid"));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
  });

  const navigateMain = () => {navigate("/main");};
  const navigateToRecordBody = () => {navigate("/recodbody");};
  const navigateFood=() => {navigate("/MealTimingselect");};
  const navigateGraph = () => {navigate("/Graph")};

  // 로그아웃 처리
  const handleLogout = async () => {
    await fetch(`http://${config.SERVER_URL}/login/logout`, {
      method: "POST",
      credentials: "include",
    });

    sessionStorage.removeItem("useridRef");
    navigate("/login");
  };

  useEffect(() => {
    if (useridRef) {
      const interval = setInterval(goToNext, 3000);
      return () => clearInterval(interval); 
    }
  }, [currentIndex, useridRef]); 

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  //슬라이드 전환 애니메이션
  const animation = useSpring({
    opacity: 1,
    transform: `scale(1.05)`,
    config: { tension: 200, friction: 30 },
  });

  const images = [
    "/image/advertisement_fitness.png",
    "/image/advertisement_gym.png",
    "/image/advertisement_main.png",
  ];
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
  
  // 로그인 상태 확인 후 `userid` 가져오기
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

  return (
    <div className="Main_Container">
    <a className="maintitle">FitEnd</a>
    
    <img src="/image/black.png" alt="Background" className="MainImage" />
    <div className="Central-Menu">
      <div className="anime_container" {...swipeHandlers}>
        <animated.div style={animation} className="slide">
          <img src={images[currentIndex]} alt="carousel" />
        </animated.div>

        <div className="anime_controls">
          <button className="prev" onClick={goToPrevious}>⟨‹</button>
          <button className="next" onClick={goToNext}>›⟩</button>
        </div>
      <div className="전체이미지지">
        <img src="/image/IMAGE1.png" alt="Background" className="optionImage" />
        <img src="/image/IMAGE2.png" alt="Background" className="optionImage" />
        <img src="/image/IMAGE3.png" alt="Background" className="optionImage" />
      </div>
    </div>
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
</div>
  );
}