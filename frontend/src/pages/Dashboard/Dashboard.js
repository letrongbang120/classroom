import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getClassById, getUserById } from "../../actions/userActions";

import ClassCard from "../../components/ClassCard/ClassCard";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      setUser(JSON.parse(localStorage.getItem("userSigninClassroom")));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (user.role === "SuperAdmin") {
      navigate('/superadmin')
    }
    if (user.role === "Admin") {
      navigate('/admin/users')
    }
    const func = async () => {
      const res = await getClassById(user.accountId, user.token);
      if (res) {
        setCourses(res)
      }
    }
    func();
  }, [user, navigate]);

  // useEffect(()=>{
  //   if (user.accountId){
  //     const getUser=async()=>{
  //       const res=await getUserById(user.accountId);
  //       if (res.block){
  //         navigate('')
  //       }
  //     }
  //   }
  // },[])

  return (
    <>
      {
        courses && courses.map(course => {
          return <ClassCard
            key={course.classId}
            name={course.name}
            teacherId={course.teacherId === user.accountId ? "Your class" : course.teacherId}
            classId={course.classId}
          />
        })
      }</>
  )
}
export default Dashboard;
