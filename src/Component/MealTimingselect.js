import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import styles from "../Style/MealTimingselect.module.css"; // Import module CSS
import config from "../config";

export default function MealTimingselect() {
    const navigate = useNavigate();
    const [userid, setUserid] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date()); // 선택한 날짜 상태
    const [mealData, setMealData] = useState([]); // 식사 데이터 저장
    // const [availableDates, setAvailableDates] = useState([]); // 기록이 있는 날짜 목록
    const mealTypes = ["moning", "lunch", "dinner", "dessert"]; // 아침, 점심, 저녁

    // 📅 날짜 포맷 변환 함수 (한국 시간 기준)
    const formatDate = (date) => {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
    };
    
    const navigateMain = () => {navigate("/main");};

    const navigateToRecordBody = () => {navigate("/recodbody");};

    const navigateFood=() => {navigate("/MealTimingselect");};

    const navigateGraph = () => {navigate("/Graph")};

    // const navigateFoodSearchR = () => {navigate("/FoodSearchR")};

    const navigatetodo = () => {navigate("/Todo")};

    const navigateCalender = () => {navigate("/Calender")};

    const handleLogout = async () => {
        await fetch(`http://${config.SERVER_URL}/login/logout`, {
            method: "POST",
            credentials: "include",
        });
        sessionStorage.removeItem("useridRef");
        navigate("/login");
    };

    const navigateFoodsearchR = (meal) => {
        navigate("/FoodSearchR", { state: { date: selectedDateFormatted, mealType: meal } });
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
                setUserid(data.userid);
                return fetch(`http://${config.SERVER_URL}/food/diet-records/${data.userid}`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                  });
                })
                .then((response) => {
                  if (!response.ok) throw new Error("서버 응답 실패");
                  return response.json();
                })
                .then((data) => {
                    console.log("📊 받은 데이터:", data);
                  setMealData(data);
                //   console.log("meal data " , mealData);
                }
            )
                .catch((error) => {
                  console.warn("⚠️ 인증 실패 또는 데이터 불러오기 실패:", error);
                  navigate("/login");
                });
            }, [navigate]);

    // 선택한 날짜의 데이터 필터링
    const selectedDateFormatted = formatDate(selectedDate);
    const filteredData = mealData.filter((record) => formatDate(new Date(record.timestamp)) === selectedDateFormatted);

    // 각 식사 유형별 데이터 분류
    const mealsByType = mealTypes.reduce((acc, meal) => {
        acc[meal] = filteredData.filter((record) => record.dietMemo === meal);
        return acc;
    }, {});

    return (
        <div className={styles.MealTimingselect_Container}>
            {/* 백그라운드 이미지랑 텍스트 */}
            <img src="/image/black.png" alt="Background" className={styles.MainImage} />
            <a className={styles.MealTimeingslelect_title}>FitEnd</a>
            <div className={styles.content}>
                {/* 꼭 필요한 배경이미지 */}
                <img src="/image/foodlist/Rectangleboder.png" alt="ground" className={styles.Rectangleground_right}></img>
                <img src="/image/foodlist/Rectangleboder.png" alt="ground" className={styles.Rectangleground_left}></img>
                <img src="/image/foodlist/Rectangleboder.png" alt="ground" className={styles.Rectangleground_bottom_right}></img>
                <img src="/image/foodlist/Rectangleboder.png" alt="ground" className={styles.Rectangleground_bottom_left}></img>
                <img src="/image/foodlist/toast_6168691.png" alt="toast" className={styles.moning_toast}></img>
                <img src="/image/foodlist/noodles_4359781.png" alt="nodles" className={styles.lunch_nodles}></img>
                <img src="/image/foodlist/roast-chicken_4490344.png" alt="roast_chicken" className={styles.dinner_roast}></img>
                <img src="/image/foodlist/cupcake_497854.png" alt="cupcake" className={styles.cupcake}></img>

                <a className={styles.Moning}>Moning</a>
                <a className={styles.Lunch}>LUNCH</a>
                <a className={styles.Dinner}>DINNER</a>
                <a className={styles.Dessert}>DESSERT</a>

                {/* <button className={styles.plus_button_left} onClick={navigateFoodsearchR}><img src="/image/foodlist/Group30.png" alt="plus"></img></button>
                <button className={styles.plus_button_right} onClick={navigateFoodsearchR}><img src="/image/foodlist/Group30.png" alt="plus"></img></button>
                <button className={styles.plus_button_bottomleft} onClick={navigateFoodsearchR}><img src="/image/foodlist/Group30.png" alt="plus"></img></button>
                <button className={styles.plus_button_bottomright} onClick={navigateFoodsearchR}><img src="/image/foodlist/Group30.png" alt="plus"></img></button> */}

                    {/* plus 버튼에 문자열 인자를 명시적으로 전달 */}
                <button
                    className={styles.plus_button_left}
                    onClick={() => navigateFoodsearchR("breakfast")}
                >
                    <img src="/image/foodlist/Group30.png" alt="plus" />
                </button>
                <button
                    className={styles.plus_button_right}
                    onClick={() => navigateFoodsearchR("lunch")}
                >
                    <img src="/image/foodlist/Group30.png" alt="plus" />
                </button>
                <button
                    className={styles.plus_button_bottomleft}
                    onClick={() => navigateFoodsearchR("dinner")}
                >
                    <img src="/image/foodlist/Group30.png" alt="plus" />
                </button>
                <button
                    className={styles.plus_button_bottomright}
                    onClick={() => navigateFoodsearchR("dessert")}
                >
                    <img src="/image/foodlist/Group30.png" alt="plus" />
                </button>

                <div className={styles.mealData}>
                    {/* 🍞 아침 (moning) */}
                    <div className={styles.mealSection_moning}>
                        {mealData.filter(record => record.dietMemo === "breakfast" && formatDate(new Date(record.timestamp)) === selectedDateFormatted).length > 0 ? (
                            <span className={styles.mealCalories_breakfast}>
                                🔥{/*  총 칼로리:  */}{
                                    mealData.filter(record => record.dietMemo === "breakfast" && formatDate(new Date(record.timestamp)) === selectedDateFormatted)
                                    .reduce((sum, record) => sum + record.enerc, 0)
                                } kcal
                            </span>
                        ) : (
                            <span className={styles.mealNoData_breakfast}>No records</span>
                        )}
                    </div>

                    {/* 🍜 점심 (lunch) */}
                    <div className={styles.mealSection_lunch}>
                        
                        {mealData.filter(record => record.dietMemo === "lunch" && formatDate(new Date(record.timestamp)) === selectedDateFormatted).length > 0 ? (
                            <span className={styles.mealCalories_lunch}>
                                🔥{/*  총 칼로리:  */}{
                                    mealData.filter(record => record.dietMemo === "lunch" && formatDate(new Date(record.timestamp)) === selectedDateFormatted)
                                    .reduce((sum, record) => sum + record.enerc, 0)
                                } kcal
                            </span>
                        ) : (
                            <span className={styles.mealNoData_lunch}>No records</span>
                        )}
                    </div>

                    {/* 🍗 저녁 (dinner) */}
                    <div className={styles.mealSection_dinner}>
                        
                        {mealData.filter(record => record.dietMemo === "dinner" && formatDate(new Date(record.timestamp)) === selectedDateFormatted).length > 0 ? (
                            <span className={styles.mealCalories_dinner}>
                                🔥 {/* 총 칼로리:  */}{
                                    mealData.filter(record => record.dietMemo === "dinner" && formatDate(new Date(record.timestamp)) === selectedDateFormatted)
                                    .reduce((sum, record) => sum + record.enerc, 0)
                                } kcal
                            </span>
                        ) : (
                            <span className={styles.mealNoData_dinner}>No records</span>
                        )}
                    </div>

                    {/* 🍰 디저트 (dessert) */}
                    <div className={styles.mealSection_dessert}>
                        
                        {mealData.filter(record => record.dietMemo === "dessert" && formatDate(new Date(record.timestamp)) === selectedDateFormatted).length > 0 ? (
                            <span className={styles.mealCalories_dessert}>
                                🔥{/*  총 칼로리:  */}{
                                    mealData.filter(record => record.dietMemo === "dessert" && formatDate(new Date(record.timestamp)) === selectedDateFormatted)
                                    .reduce((sum, record) => sum + record.enerc, 0)
                                } kcal
                            </span>
                        ) : (
                            <span className={styles.mealNoData_dessert}>No records</span>
                        )}
                    </div>
                </div>
                    <button className={styles.greenButton} onClick={navigateCalender}>
                        <span className={styles.imgAltText}>Check meal details</span>
                    </button>
                    

                    <button className={styles.yellowButton} onClick={navigatetodo}>
                        <span className={styles.imgAltTextYellow}>Calendar shortcuts</span>
                    </button>
            </div>

            {/* 기타 UI 구성 */}
            <div className={styles.buttonContainer}>
                <div className={styles.buttonItem}>
                    <img src="/image/HOME.png" alt="Main" className={styles.buttonImage} onClick={navigateMain} />
                    <span className={styles.span}>Main</span>
                </div>

                <div className={styles.buttonItem}>
                    <img src="/image/PAPAR.png" alt="Paper" className={styles.buttonImage} onClick={navigateToRecordBody} />
                    <span className={styles.span}>Paper</span>
                </div>

                <div className={styles.buttonItem}>
                    <img src="/image/Vector7.png" alt="rank" className={styles.buttonImage} onClick={navigateGraph} />
                    <span className={styles.span}>Graph</span>
                </div>

                <div className={styles.buttonItem}>
                    <img src="/image/Vector8.png" alt="Food" className={styles.buttonImage} onClick={navigateFood} />
                    <span className={styles.span}>Food</span>
                </div>

                <div className={styles.buttonItem}>
                    <img src="/image/PEOPLE.png" alt="Logout" className={styles.buttonImage} onClick={handleLogout} />
                    <span className={styles.span}>Logout</span>
                </div>
            </div>
        </div>
    );
}
