import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="home__container ">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png"
          alt="Google Classroom"
          className="home__image"
        />

        <Link to="/login">
          <button className="home__login w-100">Sign in</button>
        </Link>

        <Link to="/register" className="w-100">
          <button className="home__login w-100">Sign up</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
