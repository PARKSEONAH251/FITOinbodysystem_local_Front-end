import React, { useState } from "react";
import '../Style/legister.css';

export default function Register() {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userInfo = {
      userid,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        console.log("User registered successfully");
        // 성공 시 추가적인 로직 (예: 리다이렉트)
      } else {
        console.error("Failed to register user");
        // 실패 시 추가적인 로직
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="Register_Container">
      <img src="/image/RegisterImage.jpg" alt="Background" className="RegisterImage"></img>
      <img src="/image/Vector9.png" alt="Backgroud" className="RegisterImage_Vector"></img>
      
      <h2 className="Register_Title"></h2>
      <form onSubmit={handleSubmit}>
        <div>
          <labe className="UserRegister">ID: </labe>
          <input
            className="input_text1"
            type="text"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="userRegister_password">password</label>
          <input
            className="input_text2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="Register_Button" type="submit">Sign_up</button>
      </form>
      </div>
      

    </div>
  );
}
