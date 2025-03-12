import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useSwipeable } from "react-swipeable"; // For touch/swipe functionality
import "../Style/main.css";
import config from "../config";

export default function Main() {
  const userid = sessionStorage.getItem("userid");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [bodyrecod, setBodyRecod] = useState([]);
  const [loading, setLoading] = useState(true);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
  });

  const navigateMain = () => {
    navigate("/main");
  }

  const navigateToRecordBody = () => {
    navigate("/recodbody");
  };

  const navigateGraph = () => {
    navigate("/Graph")
  }

  const handleLogout = () => {
    sessionStorage.removeItem("userid"); // 로그아웃 시 사용자 정보 삭제
    navigate("/login"); // 로그인 페이지로 이동
  };

  useEffect(() => {
    if (!userid) {
      navigate("/login"); // 로그인 안 했으면 로그인 페이지로 강제 이동
      return;
    }

    fetch(`http://${config.SERVER_URL}/download/recentuserbody/${userid}`)
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

  // 3초씩 자동으로 슬라이드가 변경됨
  useEffect(() => {
    if (userid) {
      const interval = setInterval(goToNext, 3000);
      return () => clearInterval(interval); 
    }
  }, [currentIndex, userid]); 

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

  if (!userid) {
    return null;  
  }

  const images = [
    "/image/advertisement_fitness.png",
    "/image/advertisement_gym.png",
    "/image/advertisement_main.png",
  ];

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
          <div onClick={navigateMain} className="Button-Item">
            <img src="/image/HOME.png" alt="Main" className="ButtonImage" />
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
  );
}
