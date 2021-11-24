import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  createLink,
  getClass,
  inviteByEmail,
  joinClass,
  updateClass,
} from "../../actions/classAction";
import CourseHeader from "../../components/CourseHeader/CourseHeader";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../actions/userActions";
import { useForm } from "react-hook-form";

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
                <h6>Teacher: {members.filter(member=>member.accountId===course.teacherId)[0].username}</h6>
              </div>
            )}
          </div>
          {course.teacherId === user.accountId && (
            <div>
              <div className="container mt-5">
                <div className="row">
                  <div className="col-6">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2 className="text-right">Invite</h2>
                    </div>
                    <form onSubmit={handleSubmit(submitSendEmail)}>
                      <div>
                        <label className="labels" htmlFor="invitation">
                          Invite teacher/student by email
                        </label>
                        <input
                          type="text"
                          id="invitation"
                          className="form-control"
                          placeholder="Input email"
                          {...register("email", {
                            required: true,
                            pattern:
                              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          })}
                        ></input>
                        {errors.email?.type === "required" && (
                          <span className="error">Empty email</span>
                        )}
                        {errors.email?.type === "pattern" && (
                          <span className="error">Invalid email</span>
                        )}
                      </div>
                      <div className="mt-3 text-center">
                        <button
                          className="btn btn-primary profile-button"
                          type="submit"
                        >
                          Send invitation
                        </button>
                      </div>
                    </form>
                    <div className="mt-5">
                      <button
                        className="btn btn-primary profile-button"
                        onClick={createLinkInvite}
                      >
                        Create invite link
                      </button>
                      {link && <span className="mt-3" style={{display: 'block'}}>{link}</span>}
                    </div>
                  </div>

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
                        <label htmlFor="topic" className="labels">
                          Topic
                        </label>
                        <input
                          type="text"
                          id="topic"
                          className="form-control"
                          placeholder="Topic of Class"
                          {...register1("topic", { required: true })}
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
                </div>
              </div>

              <div className="members">
                <h2>Members in course</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members &&
                      members.map((member, index) => {
                        return (
                          <tr key={member.accountId}>
                            <td>{index}</td>
                            <td>{member.username}</td>
                            <td>{member.email}</td>
                            <td>
                              {member.accountId === course.teacherId
                                ? "Teacher"
                                : "Student"}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
}
