import { Routes, Route } from "react-router-dom";
import React from "react";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CoursePage from "./pages/CoursePage/CoursePage";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from './components/Profile/Profile';
import GradeStructure from "./pages/GradeStructure/GradeStructure";
import People from './pages/People/People';
import GradeBoard from './pages/GradeBoard/GradeBoard'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/" element={<Home />} />
        <Route exact path="/c/:courseId" element={<CoursePage />} />
        <Route exact path="/r/:courseId" element={<People />} />
        <Route exact path="/c/:courseId/grade" element={<GradeBoard />} />
        <Route
          path="/dashboard"
          element={
            <React.Fragment>
              <Navbar />
              <Dashboard />
            </React.Fragment>
          }
        />
        <Route path="/c/:courseId/grade/add" element={<GradeStructure />} />
        <Route
          path="/u/:userId"
          element={
            <React.Fragment>
              <Navbar />
              <Profile />
            </React.Fragment>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
