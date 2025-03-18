import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { useSpring, animated } from "react-spring";
import { useSwipeable } from "react-swipeable"; // For touch/swipe functionality
import "../Style/main.css";

export default function Main() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bodyrecod, setBodyRecod] = useState([]);
  const [loading, setLoading] = useState(true);
  const useridRef = useRef(sessionStorage.getItem("userid"));

  const navigateToRank = () => navigate("/rank");
  const navigateToTodo = () => navigate("/todo");

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
    await fetch(`http://${config.SERVER_URL}/request/logout`, {
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

  // 로그인 상태 확인 후 `userid` 가져오기
  useEffect(() => {
    fetch(`http://${config.SERVER_URL}/request/validate`, {
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

        // 사용자 신체 기록 가져오기
        // return fetch(`http://${config.SERVER_URL}/download/recentuserbody/${data.userid}`, {
        //   method: "GET",
        //   credentials: "include",
        //   headers: { "Content-Type": "application/json" },
        // });
      })
      // .then((response) => response.json())
      // .then((bodyData) => {
      //   console.log("신체 기록 응답 데이터:", bodyData);
      //   setBodyRecod(bodyData);
      //   setLoading(false);
      // })
      // .catch(() => {
      //   console.warn("인증 실패. 로그인 페이지로 이동");
      //   sessionStorage.removeItem("useridRef");
      //   navigate("/login");
      // });
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