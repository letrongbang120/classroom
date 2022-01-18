import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function BlockedPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      if (!JSON.parse(localStorage.getItem("userSigninClassroom")).block) {
        navigate("/dashboard");
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <div style={{ "textAlign": "center" }}>
      <h1>Your account was BLOCKED!!!</h1>
    </div>
  )
}
