import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { useSpring, animated } from "react-spring";
import { useSwipeable } from "react-swipeable";
import styles from "../Style/main.module.css";

export default function Main() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jwtString, setJwtString] = useState("");
  const useridRef = useRef(sessionStorage.getItem("userid"));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
  });

  const navigateMain = () => navigate("/main");
  const navigateToRecordBody = () => navigate("/recodbody");
  const navigateFood = () => navigate("/MealTimingselect");
  const navigateGraph = () => navigate("/Graph");

  const handleLogout = async () => {
    await fetch(`http://${config.SERVER_URL}/login/logout`, {
      method: "POST",
      credentials: "include",
    });

    sessionStorage.removeItem("userid");
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
      const response = await fetch(`http://${config.SERVER_URL}/userinfo/generation`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: sessionStorage.getItem("userid") }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const jwtString = await response.text();
      setJwtString(jwtString);
      console.log("Generated JWT:", jwtString);
    } catch (error) {
      console.error("JWT 생성 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    fetch(`http://${config.SERVER_URL}/login/validate`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unauthorized");
        return response.json();
      })
      .then((data) => {
        console.log("로그인 상태 확인 성공:", data);
        useridRef.current = data.userid;
        sessionStorage.setItem("userid", data.userid);
        const init = async () => {
          await generationJwt();
        };
        init();
      });
  }, [navigate]);

  return (
    <div className={styles.Main_Container}>
      <a className={styles.maintitle}>FitEnd</a>

      <img src="/image/black.png" alt="Background" className={styles.MainImage} />
      <div className={styles.anime_container} {...swipeHandlers}>
        <animated.div style={animation} className={styles.slide}>
          <img src={images[currentIndex]} alt="carousel" />
        </animated.div>

        <div className={styles.anime_controls}>
          <button className={styles.prev} onClick={goToPrevious}>⟨‹</button>
          <button className={styles.next} onClick={goToNext}>›⟩</button>
        </div>

        <div className={styles.전체이미지지}>
          <img src="/image/IMAGE1.png" alt="Background" className={styles.optionImage} />
          <img src="/image/IMAGE2.png" alt="Background" className={styles.optionImage} />
          <img src="/image/IMAGE3.png" alt="Background" className={styles.optionImage} />
        </div>
      </div>

      <div className={styles.Button_Container}>
        <div className={styles.Button_Item}>
          <img src="/image/HOME.png" alt="Main" className={styles.ButtonImage} onClick={navigateMain} />
          <span className={styles.Span}>Main</span>
        </div>

        <div className={styles.Button_Item}>
          <img src="/image/PAPAR.png" alt="Paper" className={styles.ButtonImage} onClick={navigateToRecordBody} />
          <span className={styles.Span}>Paper</span>
        </div>

        <div className={styles.Button_Item}>
          <img src="/image/Vector7.png" alt="Graph" className={styles.ButtonImage} onClick={navigateGraph} />
          <span className={styles.Span}>Graph</span>
        </div>

        <div className={styles.Button_Item}>
          <img src="/image/Vector8.png" alt="Food" className={styles.ButtonImage} onClick={navigateFood} />
          <span className={styles.Span}>Food</span>
        </div>

        <div className={styles.Button_Item}>
          <img src="/image/PEOPLE.png" alt="Logout" className={styles.ButtonImage} onClick={handleLogout} />
          <span className={styles.Span}>Logout</span>
        </div>
      </div>
    </div>
  );
}
