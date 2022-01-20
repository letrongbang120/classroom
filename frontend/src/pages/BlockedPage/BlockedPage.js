import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { signout } from '../../actions/userActions';

export default function BlockedPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      if (!JSON.parse(localStorage.getItem("userSigninClassroom")).block) {
        navigate("/dashboard");
      } else {
        signout();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <div style={{ "textAlign": "center" }}>
      <h1>Your account was BLOCKED!!!</h1>
      <a href='/login' className='login'>Sign in</a>
    </div>
  )
}
