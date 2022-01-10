import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default function CourseHeader(props) {
  return (
    <Navbar collapseOnSelect expand="lg" color="black" bg="variant">
      <Container>
        <Navbar.Brand href="/dashboard" style={{fontWeight: 'bold'}}>Dashboard</Navbar.Brand>
        <Nav>
          <Link to={`/c/${props.course.classId}`} style={{color:"black", fontWeight: 'bold', marginRight:'30px'}}>Stream</Link>
          <Link to={`/c/${props.course.classId}/grade`} style={{color:"black", fontWeight: 'bold', marginRight:'30px'}}>Gradeboard</Link>
          <Link to={`/r/${props.course.classId}`} style={{color:"black", fontWeight: 'bold', marginRight:'30px'}}>People</Link>
        </Nav>
        <Nav>
          <Nav.Link href={`/u/${props.user.accountId}`} style={{fontWeight: 'bold'}}>{props.user.username} </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
