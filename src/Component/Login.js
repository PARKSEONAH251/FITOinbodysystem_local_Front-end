import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Style/login.css';

export default function Login() {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userInfo = {
      userid,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/request/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      
      if (response.ok) {
        console.log("Login successful");
        sessionStorage.setItem("userid", userid); // 로그인한 사용자 정보 저장
        alert("로그인 성공!");
        navigate("/main"); //메인 페이지 이동
        // 성공 시 추가적인 로직 (예: 리다이렉트)
      } else {
        alert("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
        console.error("Invalid credentials");
        // 실패 시 추가적인 로직
      }
    } catch (error) {
      alert("서버 오류 발생! 관리자에게 문의하세요.");
      console.error("Error:", error);
    }
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <div>
      <div className="Main_Container">
        <h2 className="Main_Title"></h2>
        <img src="/image/MAIN_BACKIMAGE.png" alt="Background" className="MainImage" />
        <img src="/image/Vector9.png" alt="" className="MainImage_Vector" />
        <form onSubmit={handleSubmit}>
          <div>
            <label className="USERLOGINID_EMAIL">EMAIL</label>
            <input
              className="INPUTTEXT1"
              type="text"
              value={userid}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="USERLOGIN_PASSWORD">PASSWORD</label>
            <input
              className="INPUTTEXT2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="LOGIN_BUTTON" type="submit">LOGIN</button>
          <label className="SIGNUP_BUTTON">
            Don't have an account?
            <button className="BUTTON" onClick={handleSignUpClick}>Sign_up</button>
          </label>
        </form>
      </div>
    </div>
  );
}
