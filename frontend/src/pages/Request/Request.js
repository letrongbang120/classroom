import React from "react";
import { Table } from "react-bootstrap";
import Button from "@mui/material/Button";
import CourseHeader from "../../components/CourseHeader/CourseHeader";

const studentGrade = {
  Name: "Danh Hoang",
  Id: "18120304",
  BTCN: 8,
  BTN: 8,
  GK: 6,
  CK: 10,
  Total: 8.5,
};

const markDone = true;

const listRequests = [
  {
    fullName: "Danh Hoang",
    studentId: "18120304",
    currentPoint: 8,
    expectPoint: 9,
    content: "Diem CK cua em bi sai",
  },
  {
    fullName: "Me",
    content: "Thieu nhung cai gi?",
  },
  {
    fullName: "Danh Hoang",
    studentId: "18120304",
    content: "Thieu nhung cai gi?Thieu nhung cai gi?",
  },
  {
    fullName: "Me",
    updatedPoint: 8.5,
    content: "Done",
  },
];

export default function Request() {
  return (
    <div>
      {/* <CourseHeader course={course} user={user}/> */}
      <div>
        <Table className="grade-board">
          <thead>
            <tr>
              <th>Name</th>
              <th>Id</th>
              <th>BTCN</th>
              <th>BTN</th>
              <th>GK</th>
              <th>CK</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{studentGrade.Name}</td>
              <td>{studentGrade.Id}</td>
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
            <p>
              {item.currentPoint ? `Current Point: ${item.currentPoint}; ` : ""}
              {item.expectPoint ? `Exected Point: ${item.expectPoint}` : ""}
            </p>
            <p>
              {item.updatedPoint ? `Update Point: ${item.updatedPoint}` : ""}
            </p>
            <p>{`Content: ${item.content}`}</p>
          </div>
        ))}
        {markDone ? (
          <Button color="error">Unmark</Button>
        ) : (
          <Button color="success">Mark Done</Button>
        )}
        <form className="row" style={{ marginTop: "15px" }}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="updatePoint"
              name="updatePoint"
              placeholder="Update Point"
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
  );
}
