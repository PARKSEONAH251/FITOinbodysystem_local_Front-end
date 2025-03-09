import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useSwipeable } from "react-swipeable"; // For touch/swipe functionality
import "../Style/main.css";

export default function Main() {
  const userid = sessionStorage.getItem("userid");
  const [currentIndex, setCurrentIndex] = useState(0);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
  });

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
    <div>
      <div className="Main_Container">
        <h2 className="maintitle">FitEnd</h2>
        <img src="/image/black.png" alt="Background" className="MainImage" />
        <div className="anime_container" {...swipeHandlers}>
          <animated.div style={animation} className="slide">
            <img src={images[currentIndex]} alt="carousel" />
          </animated.div>

          <div className="anime_controls">
            <button className="prev" onClick={goToPrevious}>⟨‹</button>
            <button className="next" onClick={goToNext}>›⟩</button>
          </div>
        <div>
        <img src="/image/IMAGE1.png" alt="Background" className="optionImage" />
        <img src="/image/IMAGE2.png" alt="Background" className="optionImage" />
        <img src="/image/IMAGE3.png" alt="Background" className="optionImage" />
        </div>
      </div>      
      </div>
    </div>
  );
}
