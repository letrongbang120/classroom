import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

export default function CourseHeader(props) {
  return (
    <Navbar collapseOnSelect expand="lg" color="black" bg="variant">
      <Container>
        <Navbar.Brand href="/dashboard" style={{fontWeight: 'bold'}}>Dashboard</Navbar.Brand>
        <Nav>
          <Nav.Link href={`/c/${props.course.classId}`} style={{fontWeight: 'bold', marginRight:'5px'}}>Stream</Nav.Link>
          <Nav.Link href={`/c/${props.course.classId}/grade/add`} style={{fontWeight: 'bold', marginRight:'5px'}}>Gradeboard</Nav.Link>
          <Nav.Link href={`/r/${props.course.classId}`} style={{fontWeight: 'bold', marginRight:'5px'}}>People</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link href={`/u/${props.user.accountId}`} style={{fontWeight: 'bold'}}>{props.user.username} </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
