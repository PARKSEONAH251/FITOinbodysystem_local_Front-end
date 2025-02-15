import React, { useState } from "react";
import '../Style/legister.css';

export default function Register() {
  const [userid, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [residence, setResidence] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userInfo = {
      userid,
      email,
      password,
      residence,
      gender,
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
      } else {
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="Register_Container">
      <div className="image-wrapper">
        <img src="/image/RegisterImage.jpg" alt="Background" className="RegisterImage" />
        <img src="/image/Vector9.png" alt="Overlay" className="RegisterImage_Vector" />
      </div>

      <h2 className="Register_Title">SIGN UP</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="UserRegister">NAME</label>
          <input
            className="input_text"
            type="text"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="UserRegister">EMAIL</label>
          <input
            className="input_text"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="UserRegister">SEXUAL SELECTION</label>
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={(e) => setGender(e.target.value)}
                required
              />
              남
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={(e) => setGender(e.target.value)}
                required
              />
              여
            </label>
          </div>
        </div>
        <div>
          <label className="UserRegister">PASSWORD</label>
          <input
            className="input_text"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="UserRegister">RESIDENCE</label>
          <input
            className="input_text"
            type="text"
            value={residence}
            onChange={(e) => setResidence(e.target.value)}
            required
          />
        </div>
        <button className="Register_Button" type="submit">SIGN UP</button>
      </form>
    </div>
  );
}
