import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  createLink,
  getClass,
  inviteByEmail,
  joinClass,
  updateClass
} from "../../actions/classAction";
import { getAssignmentById, getAssignmentList } from "../../actions/gradeActions";
import { getUserById } from "../../actions/userActions";
import CourseHeader from "../../components/CourseHeader/CourseHeader";
import "./style.css";

export default function CoursePage() {
  const [showExtend, setShowExtend] = useState(false);
  const [course, setCourse] = useState();
  const [message, setMessage] = useState("");
  const { courseId } = useParams();
  const [members, setMembers] = useState([]);
  const [link, setLink] = useState("");
  const [join, setJoin] = useState(false);
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

  const [listAssignment, setListAssignment] = useState([]);
  useEffect(() => {
    const getAssignments = async () => {
      const res = await getAssignmentList(user.token);
      if (res) {
        setListAssignment(res);
      } else {
        alert("Can't get list Assignment");
      }
    }
    getAssignments();
  }, [user]);

  const onClickAssignment = async (assignmentId) => {
    const res = await getAssignmentById(assignmentId, user.token);
    if (res) {
      alert(res.description);
    } else {
      alert("Can't get this assignment!!!");
    }
  }

  return (
    <React.Fragment>
      {message && <span className="error">{message}</span>}
      {course && (
        <div>
          <CourseHeader course={course} user={user} />
          <div
            className="course-info"
            onClick={() => {
              setShowExtend(!showExtend);
            }}
          >
            <div className="course-info__inner">
              <h2>{course.name}</h2>
              <h4>{course.room}</h4>
              {join && <span className="success">You joined class</span>}
            </div>
            {showExtend && (
              <div className="course-info__extend">
                <h6>Topic: {course.theme}</h6>
                <h6>
                  Teacher:{" "}
                  {
                    members.filter(
                      (member) => member.accountId === course.teacherId
                    )[0].username
                  }
                </h6>
              </div>
            )}
          </div>
          <div>
            <div className="container mt-5">
              <div className="row">
                <div className="col-2">
                  <h3>List Assignment</h3>
                  {listAssignment?.length > 0 && listAssignment.map((item) => {
                    return (
                      <button
                        key={item.assignmentId}
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => { onClickAssignment(item.assignmentId) }}
                      >
                        <h4 className="text-right" style={{ paddingTop: "5px" }}>
                          {item.description}
                        </h4>
                        <div>Score quantity: {item.scoreQuantity}</div>
                      </button>)
                  })}

                </div>
                <div className="col-4"></div>
                {course.teacherId === user.accountId && (
                  <div className="col-6">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2 className="text-right">Setting class</h2>
                    </div>
                    <form
                      className="row g-2 needs-validation"
                      onSubmit={handleSubmit1(submitUpdateClass)}
                    >
                      <div className="col-md-12">
                        <label htmlFor="name" className="labels">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="form-control"
                          placeholder="Name of Class"
                          {...register1("name", { required: true })}
                        ></input>
                        {errors1.name?.type === "required" && (
                          <span className="error">
                            Name of class is required
                          </span>
                        )}
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="description" className="labels">
                          Description
                        </label>
                        <input
                          type="text"
                          id="description"
                          className="form-control"
                          placeholder="Description of Class"
                          {...register1("description", { required: true })}
                        ></input>
                        {errors1.description?.type === "required" && (
                          <span className="error">
                            Description of class is required
                          </span>
                        )}
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="Theme" className="labels">
                          Theme
                        </label>
                        <input
                          type="text"
                          id="theme"
                          className="form-control"
                          placeholder="Theme of Class"
                          {...register1("theme", { required: true })}
                        ></input>
                        {errors1.theme?.type === "required" && (
                          <span className="error">
                            Topic of class is required
                          </span>
                        )}
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="room" className="labels">
                          Room
                        </label>
                        <input
                          type="text"
                          id="room"
                          className="form-control"
                          placeholder="Room of Class"
                          {...register1("room", { required: true })}
                        ></input>
                        {errors1.room?.type === "required" && (
                          <span className="error">
                            Room of class is required
                          </span>
                        )}
                      </div>
                      <div className="mt-3 text-center">
                        <button
                          className="btn btn-primary profile-button"
                          type="submit"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
