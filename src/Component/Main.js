import React from "react";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const userid = sessionStorage.getItem("userid");
  const navigate = useNavigate();

  const navigateToRecordBody = () => {
    navigate("/recodbody");
  };

  return (
    <div>
      {userid ? (
        <>
          <h2>Main Screen</h2>
          <p>Welcome to the main screen!</p>
          <p>Logged in as: {userid}</p>
          <button onClick={navigateToRecordBody}>Go to RecordBody</button>
        </>
      ) : (
        <p>잘못된 접근</p>
      )}
    </div>
  );
}
