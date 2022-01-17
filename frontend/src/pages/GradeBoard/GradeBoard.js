import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClass, joinClass } from "../../actions/classAction";
import CourseHeader from "../../components/CourseHeader/CourseHeader";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { createGrade, getAssignmentByClassId, getGradeList, updateDoneGrade, uploadGradeList } from "../../actions/gradeActions";
import { Table } from "react-bootstrap";
import { getUserById } from "../../actions/userActions";

const studentGrade = {
  BTCN: 8,
  BTN: 8,
  GK: 6,
  CK: 10,
  Total: 8.5,
};

const listRequests = [
  {
    fullName: "Me",
    studentId: "18120304",
    currentPoint: 8,
    expectPoint: 9,
    content: "Diem CK cua em bi sai",
  },
  {
    fullName: "Teacher(Name)",
    content: "Thieu nhung cai gi?",
  },
  {
    fullName: "Me",
    studentId: "18120304",
    content: "Thieu nhung cai gi?Thieu nhung cai gi?",
  },
  {
    fullName: "Teacher(Name)",
    updatedPoint: 8.5,
    content: "Done",
  },
];

export default function GradeBoard() {
  const [course, setCourse] = useState();
  const [message, setMessage] = useState("");
  const { courseId } = useParams();

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
      } else {
        setMessage("Class ID is not found.");
      }
    };
    if (user.token) {
      func();
    }
  }, [courseId, user]);

  useEffect(() => {
    if (course && user) {
      if (course.teacherId !== user.accountId && !course.studentIds) {
        const invite = async () => {
          const res = await joinClass(course.classId, user.token);
          if (res) {
            setCourse(res);
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
            }
          };
          invite();
        }
      }
    }
  }, [course, user]);

  const [assignmentDetail, setAssignmentDetail] = useState({});
  useEffect(() => {
    if (user.token) {
      const getAssignment = async () => {
        const res = await getAssignmentByClassId(courseId, user.token);
        if (res) {
          setAssignmentDetail(res);
        }
      };
      getAssignment();
    }
  }, [user, courseId]);

  const getHeaderAssignment = (assignment) => {
    const header = [];
    header.unshift("studentID");
    for (let i = 0; i < assignment.scores.length; i++) {
      header.push(`${assignment.scores[i].name}`);
    }
    return header;
  };

  const [gradeFile, setGradeFile] = useState();

  const changeFileHandler = (e) => {
    setGradeFile(e.target.files[0]);
  };

  const [dataGradeBoard, setDataGradeBoard] = useState([]);
  const [gradeBoard, setGradeBoard] = useState([]);

  const uploadGrade = async () => {
    if (assignmentDetail.assignmentId) {
      console.log(assignmentDetail);
      const res = await uploadGradeList(
        assignmentDetail.assignmentId,
        gradeFile,
        user.token
      );
      if (res) {
        alert("Your grade has been already uploaded success.");
        const resData = await getGradeList(user.token);
        if (resData) {
          const list = resData.filter(
            (item) => item.assignmentId === assignmentDetail.assignmentId
          );
          let data = [];
          for (const student of list) {
            let row = [];
            row[0] = student.studentId;
            for (let i = 0; i < student.scores.length; i++) {
              row[i + 1] = Number(student.scores[i]);
            }
            data.push(row);
          }
          console.log(data);
          setDataGradeBoard(data);
          setGradeBoard(list);
        }
      } else {
        alert("Upload FAIL!!!");
      }
    }
  };

  const [showTable, setShowTable] = useState(false);
  const [students, setStudents] = useState([]);
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

  let scores = [];

  const submitGrade = async (student, index) => {
    const scoresGrade = [];
    for (let i = 0; i < assignmentDetail.scores.length; i++) {
      scoresGrade.push(scores[index * assignmentDetail.scores.length + i]);
    }
    const res = await createGrade(student.studentId, assignmentDetail.assignmentId, student.accountId, scoresGrade, false, user.token);
    if (!res) alert("fail");
  }

  const [showGrades, setShowGrades] = useState(false);
  const onShowGrage = async () => {
    setShowGrades(!showGrades);
    const resData = await getGradeList(user.token);
    if (resData) {
      const list = resData.filter((item) => item.assignmentId === assignmentDetail.assignmentId);
      let data = [];
      for (const student of list) {
        let row = [];
        row[0] = student.studentId;
        for (let i = 0; i < student.scores.length; i++) {
          row[i + 1] = Number(student.scores[i]);
        }
        data.push(row);
      }
      setDataGradeBoard(data);
      setGradeBoard(list);
    }
  }

  const calcTotal = (item) => {
    if (assignmentDetail) {
      let total = 0;
      for (let i = 0; i < assignmentDetail.scores.length; i++) {
        total = total + Number(assignmentDetail.scores[i].composition) * Number(item.scores[i]) / 100;
      }
      return total;
    }
  }

  const setDoneGrade = async (grade) => {
    const res = await updateDoneGrade(grade.studentId, grade.assignmentId, grade.accountId, grade.scores, true, user.token);
    if (!res) {
      alert("fail")
    } else {
      alert("OK")
    }
  }
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
                    <button type="button" className="btn btn-primary">
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
                    {assignmentDetail.scores && (
                      <CSVLink
                        className="btn-download"
                        data={[]}
                        headers={[getHeaderAssignment(assignmentDetail)]}
                        filename="grade_webnc"
                      >
                        Download
                      </CSVLink>
                    )}
                  </div>

                  <div className="col-3 text-center">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="text-right">
                        Upload grades of all students
                      </h4>
                    </div>
                    {assignmentDetail && (
                      <div className="assignment-upload">
                        <h5>{assignmentDetail.description}</h5>
                        <input
                          className="input"
                          type="file"
                          filetypes={".csv"}
                          onChange={(e) => {
                            changeFileHandler(e);
                          }}
                        />
                      </div>
                    )}
                    <button onClick={uploadGrade} className="btn-download">
                      Add
                    </button>
                  </div>

                  <div className="col-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="text-center">Export Grade Board</h4>
                    </div>
                    {assignmentDetail.scores && (
                      <CSVLink
                        headers={[getHeaderAssignment(assignmentDetail)]}
                        data={dataGradeBoard}
                        filename="grade_webnc"
                        className="link-download text-center"
                      >
                        Download now
                      </CSVLink>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {course.teacherId === user.accountId && <button onClick={() => { setShowTable(!showTable) }}>{showTable ? 'Hide' : 'Show'} table</button>}
          {(showTable && assignmentDetail.scores) && <div>
            <Table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>StudentId</th>
                  <th>Name</th>
                  {assignmentDetail.scores.map(item => {
                    return (
                      <th key={item.name}>{item.name} ({item.composition}%)</th>
                    )
                  })}
                  <th>More</th>
                </tr>
              </thead>
              <tbody>
                {
                  students.map((item, index) => {
                    return (
                      <tr key={item.studentId}>
                        <td>{index + 1}</td>
                        <td>{item.studentId}</td>
                        <td>{item.username}</td>
                        {assignmentDetail.scores.map((item, i) => {
                          return (
                            <td key={item.name}>
                              <input
                                type="number"
                                onChange={(e) => {
                                  scores[index * assignmentDetail.scores.length + i] = Number(e.target.value);
                                }}
                              />
                            </td>
                          )
                        })}
                        <td>
                          <button onClick={() => { submitGrade(item, index) }}>Add</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </div>
          }
          <button onClick={onShowGrage}>{showGrades ? 'Hide' : 'Show'} grade</button>
          <div>
            {showGrades &&
              <Table className="grade-board">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student ID</th>
                    <th>Score</th>
                    <th>Total</th>
                    <th>State</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeBoard.map((item, index) => {
                    if (item.done || course.teacherId === user.accountId)
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.studentId}</td>
                          <td>{item?.scores.map((score, index) => {
                            return <span key={index} className="score">{score}</span>
                          })}</td>
                          <td>
                            <span className="score">
                              {calcTotal(item)}
                            </span>
                          </td>
                          <td>
                            {item.done ?
                              <span className="score" onClick={() => { console.log(item) }}>Ok</span> :
                              <button
                                className="btn btn-success mt-0"
                                onClick={() => { setDoneGrade(item) }}
                              >
                                Done
                              </button>
                            }
                          </td>
                          <td>
                            <button>Request</button>
                          </td>
                        </tr>
                      )
                    else return <tr key={index}></tr>
                  })}
                </tbody>
              </Table>
            }
          </div>
          <div>
            <Table className="grade-board">
              <thead>
                <tr>
                  <th>BTCN</th>
                  <th>BTN</th>
                  <th>GK</th>
                  <th>CK</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{studentGrade.BTCN}</td>
                  <td>{studentGrade.BTN}</td>
                  <td>{studentGrade.GK}</td>
                  <td>{studentGrade.CK}</td>
                  <td>{studentGrade.Total}</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div style={{ padding: "50px 150px 0 150px" }}>
            {listRequests.map((item, index) => (
              <div key={index} style={{ marginBottom: "40px" }}>
                <h5>{item.fullName}</h5>
                <p>{item.studentId ? `StudentId: ${item.studentId}` : ""}</p>
                <p>{item.currentPoint ? `Current Point: ${item.currentPoint}; ` : ""}{item.expectPoint ? `Exected Point: ${item.expectPoint}` : ""}</p>
                <p>{item.updatedPoint ? `Update Point: ${item.updatedPoint}` : ""}</p>
                <p>{`Content: ${item.content}`}</p>
              </div>
            ))}
            <form className="row" style={{ marginTop: "15px" }}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="currentPoint"
                  name="currentPoint"
                  placeholder="Your current grade"
                  style={{ marginBottom: "10px" }}
                />
                <input
                  type="text"
                  className="form-control"
                  id="expectedPoint"
                  name="expectedPoint"
                  placeholder="Your expected grade"
                  style={{ marginBottom: "10px" }}
                />
                <input
                  type="text"
                  className="form-control"
                  id="comment"
                  name="comment"
                  placeholder="Add your comment"
                  style={{ marginBottom: "10px" }}
                />
              </div>

              <div
                className=""
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button className="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
