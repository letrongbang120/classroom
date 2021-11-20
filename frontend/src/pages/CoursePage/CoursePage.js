import Button from '@restart/ui/esm/Button';
import React, { useState } from 'react'
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import CourseHeader from '../../components/CourseHeader/CourseHeader';
import './styles.css'

export default function CoursePage() {
  const [showExtend, setShowExtend] = useState(false);
  const { courseId } = useParams();
  const members = [
    {
      _id: "1",
      name: "Le Trong Bang",
      email: "banglt@email.com",
    },
    {
      _id: "2",
      name: "Bui Hoan Hao",
      email: "hao@email.com",
    },
    {
      _id: "3",
      name: "Vo Van Hoang Danh",
      email: "danh@email.com",
    },
  ]
  const course = {
    _id: courseId,
    name: "[CQ] PTUDWNC - 18_3",
    part: "PTUDWNC",
    theme: "CQ 18_3",
    room: "12",
    members: members
  };

  return (
    <React.Fragment>
      <CourseHeader course={course} />
      <div className="course-info" onClick={() => { setShowExtend(!showExtend) }}>
        <div className="course-info__inner">
          <h2>{course.name}</h2>
          <h4>{course.part}</h4>
        </div>
        {showExtend && <div className="course-info__extend">
          <h6>Topic: {course.theme}</h6>
        </div>}
      </div>
      <div className="members">
        <h2>Members in course</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              course.members.map(member =>
                <tr key={member._id}>
                  <td>{member._id}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td><Button variant="danger">Remove</Button></td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </div>
    </React.Fragment>
  )
}
