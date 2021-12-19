import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import {
  createLink,
  getClass,
  inviteByEmail,
  joinClass,
  updateClass,
} from "../../actions/classAction";
import CourseHeader from "../../components/CourseHeader/CourseHeader";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../actions/userActions";
import { useForm } from "react-hook-form";

export default function GradeBoard() {
  const [course, setCourse] = useState();
  const [message, setMessage] = useState("");
  const { courseId } = useParams();
  const [members, setMembers] = useState([]);
  const [link, setLink] = useState("");
  const [join, setJoin] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    formState: { errors: errors1 },
  } = useForm();

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
    const func = async () => {
      const result = await getClass(courseId, user.token);
      if (result) {
        setCourse(result);
        setValue1("name", result.name);
        setValue1("description", result.description);
        setValue1("theme", result.theme);
        setValue1("room", result.room);
      } else {
        setMessage("Class ID is not found.");
      }
    };
    if (user.token) {
      func();
    }
  }, [courseId, user, setValue1]);

  useEffect(() => {
    if (course && user) {
      if (course.teacherId !== user.accountId && !course.studentIds) {
        const invite = async () => {
          const res = await joinClass(course.classId, user.token);
          if (res) {
            setCourse(res);
            setJoin(true);
          }
        };
        invite();
      } else {
        if (
          course.teacherId !== user.accountId &&
          !course.studentIds.includes(user.accountId)
        ) {
          const invite = async () => {
            const res = await joinClass(course.classId, user.token);
            if (res) {
              setCourse(res);
              setJoin(true);
            }
          };
          invite();
        }
      }
    }
  }, [course, user]);

  useEffect(() => {
    if (course) {
      const insertTeacher = async () => {
        const res = await getUserById(course.teacherId);
        setMembers((prevMembers) => {
          if (prevMembers.includes(res)) {
            return prevMembers;
          } else {
            return [...prevMembers, res];
          }
        });
      };
      insertTeacher();
      if (course.studentIds) {
        for (const studentId of course.studentIds) {
          const insertStudent = async (id) => {
            const res = await getUserById(id);
            setMembers((prevMembers) => [...prevMembers, res]);
          };
          insertStudent(studentId);
        }
      }
    }
  }, [course]);

  useEffect(() => {
    if (course) {
      const insertTeacher = async () => {
        const res = await getUserById(course.teacherId);
        setTeachers((prevMembers) => {
          if (prevMembers.includes(res)) {
            return prevMembers;
          } else {
            return [...prevMembers, res];
          }
        });
      };
      insertTeacher();
    }
  }, [course, user]);

  useEffect(() => {
    if (course) {
      if (course.studentIds) {
        for (const studentId of course.studentIds) {
          const insertStudent = async (id) => {
            const res = await getUserById(id);
            setStudents((prevMembers) => [...prevMembers, res]);
          };
          insertStudent(studentId);
        }
      }
    }
  }, [course, user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submitSendEmail = (data) => {
    const send = async () => {
      const res = await inviteByEmail([data.email], course.classId, user.token);
      if (res) {
        alert("invited successful !!!");
      } else {
        alert("invited fail");
      }
    };
    send();
  };

  const createLinkInvite = async () => {
    const res = await createLink(course.classId, user.token);
    setLink(res);
  };

  const submitUpdateClass = (data) => {
    const update = async () => {
      const res = await updateClass(
        course.classId,
        data.name,
        data.description,
        data.theme,
        data.room,
        user.token
      );
      if (res) {
        alert("success. Reload to see the change");
      } else {
        alert("update fail");
      }
    };
    if (window.confirm("Do you want to update?")) {
      update();
    }
  };

  return (
    <React.Fragment>
      {message && <span className="error">{message}</span>}
      {course && (
        <div>
          <CourseHeader course={course} user={user} />

          <div>
            {course.teacherId === user.accountId && (
              <div className="container mt-5">
                <div className="row">
                  <div className="col-3 text-center">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="text-right">Edit grade an assignments</h4>
                    </div>
                    <button type="button" class="btn btn-primary">
                      <Link to={`/c/${courseId}/grade/add`}>Edit</Link>
                    </button>
                  </div>

                  <div className="col-3 text-center">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="text-right">
                        Download default csv file template for grades for an
                        assignment
                      </h4>
                    </div>
                    <button className="btn btn-primary">Download</button>
                  </div>

                  <div className="col-3 text-center">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="text-right">
                        Upload grades of all students
                      </h4>
                    </div>
                    <input className="input" type="file" />
                  </div>

                  <div className="col-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="text-center">Export Grade Board</h4>
                    </div>
                    <div style={{marginLeft: '70px'}}>
                    <button className="btn btn-primary">Export</button>
                    </div>
                    
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
