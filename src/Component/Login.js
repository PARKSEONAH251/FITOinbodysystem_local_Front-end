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
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        console.log("Login successful");
        sessionStorage.setItem("userid", userid);
        navigate("/main");
        // 성공 시 추가적인 로직 (예: 리다이렉트)
      } else {
        console.error("Invalid credentials");
        // 실패 시 추가적인 로직
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="Main_Container">
        <h2 className="Main_Title"></h2>
        <img src="/image/MAIN_BACKIMAGE.png" alt="Background" className="MainImage"></img>
        <img src="/image/Vector9.png" alt="" className="MainImage_Vector"></img>
        <form onSubmit={handleSubmit}>
        <div>
          <labe className="USERLOGINID_EMAIL">EMAIL</labe>
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
      </form>
      </div>
    </div>
  );
}
