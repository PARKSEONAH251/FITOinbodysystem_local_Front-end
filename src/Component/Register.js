import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅
import '../Style/legister.css';

export default function Register() {
  const navigate = useNavigate(); // 페이지이동 userNavigate()

  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [isPostcodeLoaded, setIsPostcodeLoaded] = useState(false);
  
  const [userInfo, setUserInfo] = useState({
    userid: "",
    password: "",
    email: "",
    sex: "",
    region1: "",
    region2: "",
    birth: "",
  });

  // 현재 날짜 기준으로 최소 1년 전 날짜 계산 (오늘 날짜나 미래 날짜 선택시 데이터베이스에 부적절한 값이 적용됨됨)
  const minBirthDate = new Date();
  minBirthDate.setFullYear(minBirthDate.getFullYear() - 100); // 최대 100년 전까지 입력 가능
  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 1); // 최소 1살부터 가입 가능

  // eslint-disable-next-line no-undef
  useEffect(() => {
    const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;
    if (!kakaoApiKey) {
      console.error("🚨 Kakao API 키가 설정되지 않았습니다! .env 파일을 확인하세요.");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services`;
    script.async = true;
    script.onload = () => setIsKakaoLoaded(true);
    script.onerror = () => console.error("🚨 Kakao Map API 로드 실패!");

    document.head.appendChild(script);

    const loadPostcodeScript = () => {
      if (window.daum && window.daum.Postcode) {
        setIsPostcodeLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      script.onload = () => setIsPostcodeLoaded(true);
      script.onerror = () => console.error("🚨 우편번호 API 로드 실패!");

      document.body.appendChild(script);
    };

    loadPostcodeScript();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/upload/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        alert("회원가입이 성공적으로 완료되었습니다.");
        console.log("User registered successfully");
        navigate("/login"); // 가입 성공시 login페이지 이동
      } else {
        alert("회원가입 실패! 입력한 정보를 다시 확인해주세요.");
        console.error("Failed to register user");
        // 실패 시 추가적인 로직
      }
    } catch (error) {
      alert("관리자에게 문의해주세요.");
      console.error("Error:", error);
    }
  };

  const handleAddressSearch = () => {
    if (!isKakaoLoaded || !isPostcodeLoaded) {
      alert("🚨 카카오맵 API 또는 우편번호 API가 아직 완전히 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!window.daum || !window.daum.Postcode) {
      alert("🚨 우편번호 검색 API가 아직 로드되지 않았습니다. 새로고침 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        setUserInfo({ ...userInfo, region1: data.sido, region2: data.sigungu });
      },
    }).open();
  };

  return (
    <div className="Register_Container">
      <div className="Main_container">
        <div className="Main_image">
          <img src="/image/RegisterImage.jpg" alt="Background" className="RegisterImage" />
          <img src="/image/Vector9.png" alt="Overlay" className="RegisterImage_Vector" />
        </div>
      </div>

      <h2 className="Register_Title">SIGN UP</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label className="NAME">NAME</label>
          <input
            className="input_text"
            type="text"
            value={userInfo.userid}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="EMAIL">EMAIL</label>
          <input
            className="input_text"
            type="email"
            value={userInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="SEXUAL_SELECTION">SEXUAL SELECTION</label>
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={userInfo.sex === "1"}
                onChange={handleChange}
                required
              />
              남
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={userInfo.sex === "2"}
                onChange={handleChange}
                required
              />
              여
            </label>
          </div>
        </div>
        <div>
          <label className="PASSWORD">PASSWORD</label>
          <input
            className="input_text"
            type="password"
            value={userInfo.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="PROVINCE">PROVINCE</label>
          <input
            className="input_text"
            type="text"
            name="region1"
            value={userInfo.region1}
            readOnly
          />
        </div>
        <div>
          <label className="CITY">
            CITY
            <button className="CITY_Button" type="button" onClick={handleAddressSearch}>주소 검색</button>
          </label>
          <input 
            className="input_text"
            type="text" 
            name="region2" 
            value={userInfo.region2} 
            readOnly 
          />
          <div>
            <label className="BIRTH">BIRTH</label>
            <input
              className="input_text"
              type="date"
              name="birth"
              value={userInfo.birth}
              onChange={handleChange}
              min={minBirthDate.toISOString().split("T")[0]} // 최대 100년 전까지 입력 가능
              max={maxBirthDate.toISOString().split("T")[0]} // 최소 1살부터 가입 가능
              required
            />
        </div>  
        </div>
        <button className="Register_Button" type="submit">SIGN UP</button>
      </form>
    </div>
  );
}
