import { Routes, Route } from "react-router-dom";
import React from "react";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CoursePage from "./pages/CoursePage/CoursePage";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import GradeStructure from "./pages/GradeStructure/GradeStructure";
import People from "./pages/People/People";
import GradeBoard from "./pages/GradeBoard/GradeBoard";
import SuperAdmin from "./pages/SuperAdmin/SuperAdmin";
import CreateAdmin from "./components/CreateAdmin/CreateAdmin";
import AdminDetails from "./components/AdminDetail/AdminDetails";
import AdminPage from "./pages/AdminPage/AdminPage";
import SuperAdminHeader from "./components/SuperAdminHeader/SuperAdminHeader";
import AdminHeader from "./components/AdminHeader/AdminHeader";
import UserDetails from "./components/UserDetails/UserDetails";
import Classes from "./components/Classes/Classes";
import ClassDetails from "./components/ClassDetails/ClassDetails";

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

        {/* SuperAdmin Route */}
        <Route exact path="/superadmin" element={<SuperAdmin />} />
        <Route
          exact
          path="/superadmin/add"
          element={
            <React.Fragment>
              <SuperAdminHeader />
              <CreateAdmin />
            </React.Fragment>
          }
        />
        <Route
          exact
          path="/superadmin/details"
          element={
            <React.Fragment>
              <SuperAdminHeader />
              <AdminDetails />
            </React.Fragment>
          }
        />
        {/* End SuperAdmin Route */}

        {/* Admin Route */}
        <Route exact path="/admin/users" element={<AdminPage />} />
        <Route
          exact
          path="/admin/user/:userId"
          element={
            <React.Fragment>
              <AdminHeader />
              <UserDetails />
            </React.Fragment>
          }
        />
        <Route
          exact
          path="/admin/classes"
          element={
            <React.Fragment>
              <AdminHeader />
              <Classes />
            </React.Fragment>
          }
        />
        <Route
          exact
          path="/admin/class/:classId"
          element={
            <React.Fragment>
              <AdminHeader />
              <ClassDetails />
            </React.Fragment>
          }
        />
        {/* End Admin Route */}
      </Routes>
    </div>
  );
}

export default App;
