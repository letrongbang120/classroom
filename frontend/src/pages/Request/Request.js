import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getAssignmentById, getGrade } from "../../actions/gradeActions";
import { createReview, getReviewList } from "../../actions/reviewAction";
import { useForm } from "react-hook-form";
import { getUserById } from "../../actions/userActions";
import { getClass } from "../../actions/classAction";

export default function Request(props) {
  // const [markDone, setMarkDone] = useState(false);
  const [user, setUser] = useState({});
  const [student, setStudent] = useState({});
  const { studentId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const getStudent = async () => {
      const res = await getUserById(studentId);
      if (res) {
        setStudent(res);
      } else navigate("/dashboard");
    };
    getStudent();
    if (localStorage.getItem("userSigninClassroom")) {
      setUser(JSON.parse(localStorage.getItem("userSigninClassroom")));
    } else {
      navigate("/login");
    }
  }, [navigate, studentId]);

  const { assignmentId } = useParams();
  const [assignmentDetail, setAssignmentDetail] = useState({});
  useEffect(() => {
    if (user.token && assignmentId) {
      const getAssignment = async () => {
        const res = await getAssignmentById(assignmentId, user.token);
        if (res) {
          setAssignmentDetail(res);
        }
      };
      getAssignment();
    }
  }, [user, assignmentId]);

  const [teacherId, setTeacherId] = useState('');
  useEffect(() => {
    if (assignmentDetail.classId && user.token) {
      const getTeacher = async () => {
        const res = await getClass(assignmentDetail.classId, user.token);
        if (res) {
          setTeacherId(res.teacherId);
        }
      }
      getTeacher();
    }
  }, [assignmentDetail, user])

  const [grade, setGrade] = useState({});
  useEffect(() => {
    if (user) {
      const getGradeDetail = async () => {
        const res = await getGrade(assignmentId, student.studentId, user.token);
        if (res) {
          setGrade(res);
        }
      };
      getGradeDetail();
    }
  }, [user, assignmentId, student]);

  const calcTotal = (item) => {
    if (assignmentDetail.scores) {
      let total = 0;
      for (let i = 0; i < assignmentDetail.scores.length; i++) {
        total =
          total +
          (Number(assignmentDetail.scores[i].composition) *
            Number(item.scores[i])) /
          100;
      }
      return total;
    }
  };

  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    if (user) {
      const getReviews = async () => {
        const res = await getReviewList(user.token);
        if (res) {
          let data = [];
          for (const review of res) {
            if (
              review.assignmentId === assignmentId &&
              (review.studentId === user.studentId ||
                review.studentId === student.studentId)
            ) {
              data.push(review);
            }
          }
          setReviews(data);
        }
      };
      getReviews();
    }
  }, [assignmentId, user, student, reviews]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onCreateReview = async (review) => {
    const comments = [
      {
        accountId: grade.accountId,
        content: review.comment,
      },
    ];
    const res = await createReview(
      assignmentId,
      50,
      user.accountId,
      grade.studentId,
      user.username,
      0,
      Number(review.currentPoint),
      Number(review.expectedPoint),
      comments,
      user.token
    );
    if (res) {
      if (user.accountId !== studentId) {
        props.socket.emit("sendNotification", {
          senderName: user.accountId,
          receiverName: studentId,
          message: review.comment
        });
      }
      else {
        props.socket.emit("sendNotification", {
          senderName: studentId,
          receiverName: teacherId,
          message: review.comment
        });
      }
      alert("success");
    } else {
      alert("fail");
    }
  };

  return (
    <div>
      <a
        href={`/c/${assignmentDetail.classId}/grade`}
        style={{ color: "#000" }}
      >
        Back to Grade board
      </a>
      <div>
        {grade.scores && (
          <Table className="grade-board">
            <thead>
              <tr>
                <th>StudentID</th>
                <th>Scores</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{grade.studentId}</td>
                <td>
                  {grade.scores.map((item, index) => {
                    return (
                      <span className="score" key={index}>
                        {item}
                      </span>
                    );
                  })}
                </td>
                <td>{calcTotal(grade)}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </div>
      <div style={{ padding: "50px 150px 0 150px" }}>
        {reviews &&
          reviews.map((item, index) => (
            <div className="card" key={index} style={{ marginBottom: "40px" }}>
              <div className="card-header">
                <h5>{item.fullName}</h5>
                {item.accountId === studentId && (
                  <p>{`StudentId: ${item.studentId}`}</p>
                )}
              </div>
              <div className="card-body">
                <p>
                  {item.currentPoint
                    ? `Current Point: ${item.currentPoint}; `
                    : ""}
                  {item.expectPoint ? `Exected Point: ${item.expectPoint}` : ""}
                </p>
                <p>
                  {item.updatedPoint
                    ? `Update Point: ${item.updatedPoint}`
                    : ""}
                </p>
                <p>{`Content: ${item.comments[0].content}`}</p>
              </div>
            </div>
          ))}
        {/* { markDone ? (
          <Button color="error" onClick={() => { setMarkDone(!markDone) }}>Unmark</Button>
        ) : (
          <Button color="success" onClick={() => { setMarkDone(!markDone) }}>Mark Done</Button>
        )} */}
        <form
          className="row"
          style={{ marginTop: "15px" }}
          onSubmit={handleSubmit(onCreateReview)}
        >
          <div className="form-group">
            {user.accountId === studentId && (
              <div>
                <input
                  type="number"
                  className="form-control"
                  id="currentPoint"
                  style={{ marginBottom: "10px" }}
                  placeholder="Current Point"
                  // disabled={markDone}
                  {...register("currentPoint", { required: true })}
                />
                {errors.currentPoint?.type === "required" && (
                  <span className="error">Current point is required.</span>
                )}
                <input
                  type="number"
                  className="form-control"
                  id="expectedPoint"
                  style={{ marginBottom: "10px" }}
                  placeholder="Expected Point"
                  // disabled={markDone}
                  {...register("expectedPoint", { required: true })}
                />
                {errors.expectedPoint?.type === "required" && (
                  <span className="error">Expected point is required.</span>
                )}
              </div>
            )}
            <input
              type="text"
              className="form-control"
              id="comment"
              style={{ marginBottom: "10px" }}
              placeholder="Add your comment"
              // disabled={markDone}
              {...register("comment", { required: true })}
            />
            {errors.comment?.type === "required" && (
              <span className="error">Comment is required.</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
