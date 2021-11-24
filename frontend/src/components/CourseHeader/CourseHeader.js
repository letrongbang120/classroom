import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

export default function CourseHeader(props) {
  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/dashboard">{props.course.name}</Navbar.Brand>
        <Nav>
          <Nav.Link href={`/u/${props.user.accountId}`}>{props.user.username} </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
