import React, { useEffect, useState } from "react";

export default function TeToris() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/test") // 절대 경로로 수정
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);
  return (
    <div>
      <h1>User List</h1>
      여기는 초기 테스트용
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
