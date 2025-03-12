// FoodDetail.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import '../Style/FoodDetail.css';

export default function FoodDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const mealType = params.get('meal');
  const selectedDate = params.get('date');

  const [foodName, setFoodName] = useState('');
  const [foods, setFoods] = useState([]);

  const navigateMain = () => {
    navigate("/main");
  }

  const navigateToRecordBody = () => {
    navigate("/recodbody");
  };

  const navigateGraph = () => {
    navigate("/Graph")
  }

const navigateFood = ()=>{
  navigate("/FoodList")
}

const handleLogout = () => {
  sessionStorage.removeItem("userid"); // 로그아웃 시 사용자 정보 삭제
  navigate("/login"); // 로그인 페이지로 이동
};

  const searchFood = async () => {
    try {
      const response = await fetch(`http://localhost:8080/request/foodname/${foodName}`);
      if (!response.ok) throw new Error('음식 정보를 가져오는 데 실패했습니다.');
      const data = await response.json();
      setFoods(data);
    } catch (error) {
      console.error('오류 발생:', error);
      setFoods([]);
    }
  };

  const saveFood = async (food) => {
    try {
      const response = await fetch('http://localhost:8080/upload/recordfood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          mealType,
          foodName: food.foodNm,
          calories: food.enerc,
        }),
      });
      if (!response.ok) throw new Error('음식 저장 실패');
      alert('음식이 저장되었습니다!');
      navigate(-1);
    } catch (error) {
      console.error('저장 오류:', error);
    }
  };

  return (
    <div>
        <div className="Main_Container">
                <img src="/image/black.png" alt="Background" className="MainImage" />
                <a className="maintitle">FitEnd</a>
                <div className="food-detail-container">
                <h2 className='meal-state'>{mealType === 'breakfast' ? '아침' : mealType === 'lunch' ? '점심' : '저녁'} 음식 추가</h2>
                <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="음식 이름 입력"
                />
                <button onClick={searchFood}>검색</button>
                <ul className="food-list">
                    {foods.map((food, index) => (
                        <li key={index} onClick={() => saveFood(food)}>
                    {food.foodNm} - {food.mfrNm} (칼로리: {food.enerc} kcal)
                    </li>
                    ))}
                </ul>

                <div className="button-container">
                    <div className="button-item">
                        <img src="/image/HOME.png" alt="Main" className="buttonimage" onClick={navigateMain} />
                        <span className="span">Main</span> {/* 이미지 아래에 텍스트 추가 */}
                    </div>

                    <div className="button-item">
                        <img src="/image/PAPAR.png" alt="Paper" className="buttonimage" onClick={navigateToRecordBody} />
                        <span className="span">Paper</span> {/* 이미지 아래에 텍스트 추가 */}
                    </div>

                    <div className="button-item">
                        <img src="/image/Vector7.png" alt="Graph" className="buttonimage" onClick={navigateGraph} />
                        <span className="span">Graph</span> {/* 이미지 아래에 텍스트 추가 */}
                    </div>

                    <div className="button-item">
                        <img src="/image/Vector8.png" alt="Food" className="buttonimage" onClick={navigateFood}/>
                        <span className="span">Food</span> {/* 이미지 아래에 텍스트 추가 */}
                    </div>

                    <div className="button-item">
                        <img src="/image/PEOPLE.png" alt="Logout" className="buttonimage" onClick={handleLogout} />
                        <span className="span">Logout</span> {/* 이미지 아래에 텍스트 추가 */}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
}