import React from "react";

const ErrorMessage = ({ errorCode }) => {
  const errorMessages = {
    400: "잘못된 요청입니다. 입력값을 확인하세요.",
    401: "인증되지 않은 사용자입니다. 로그인 후 이용하세요.",
    403: "접근이 차단되었습니다. 로그인 시도 횟수를 초과했습니다.",
    404: "요청한 정보를 찾을 수 없습니다.",
    500: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도하세요.",
  };

  return (
    <div className="error-container">
      <p className="error-message">
        {errorMessages[errorCode] || "알 수 없는 오류가 발생했습니다."}
      </p>
    </div>
  );
};

export default ErrorMessage;
