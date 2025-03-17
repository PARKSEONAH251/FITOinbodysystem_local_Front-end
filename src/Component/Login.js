import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import '../Style/login.css';
export default function Login() {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleSignUpClick = () => {
    navigate('/register');
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const userInfo = {
      userid,
      password,
    };

    try {
      const response = await fetch(`http://${config.SERVER_URL}/login/login`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userInfo),
        }
      );

      if (response.ok) {
        const data = await response.json();

        console.log(data);

        alert("로그인 성공!");
        sessionStorage.setItem("userid", userid); 
        navigate("/main"); //메인 페이지 이동
      } else if (response.status === 403) {
        // 로그인 차단 (5회 이상 실패)
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
    <div>
      <div className="Main_Container">
        <h2 className="Main_Title"></h2>
        <img src="/image/MAIN_BACKIMAGE.png" alt="Background" className="MainImage" />
        <img src="/image/Vector9.png" alt="" className="MainImage_Vector" />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* 로그인 5회 실패시 에러메세지 p태그로 반환 */}
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