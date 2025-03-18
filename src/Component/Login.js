import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import styles from "../Style/login.module.css";

export default function Login() {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUpClick = () => navigate("/register");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://${config.SERVER_URL}/login/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userid, password }),
      });

      if (response.ok) {
        alert("로그인 성공!");
        sessionStorage.setItem("userid", userid);
        navigate("/main");
      } else if (response.status === 403) {
        const data = await response.json();
        setErrorMessage(data.error || "여러 번 시도하셨습니다. 잠시 후 다시 시도하세요.");
      } else {
        setErrorMessage("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
      }
    } catch (error) {
      setErrorMessage("서버 오류 발생! 관리자에게 문의하세요.");
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.mainTitle}></h2>
      <img src="/image/MAIN_BACKIMAGE.png" alt="Background" className={styles.mainImage} />
      <img src="/image/Vector9.png" alt="" className={styles.mainImageVector} />

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>EMAIL</label>
          <input
            className={styles.input}
            type="text"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>PASSWORD</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className={styles.loginButton} type="submit">LOGIN</button>

        <div className={styles.signupContainer}>
          <span>Don't have an account?</span>
          <button className={styles.signupButton} onClick={handleSignUpClick}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}
