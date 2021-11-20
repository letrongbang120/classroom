import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

export default function CourseHeader(props) {

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/">{props.course.name}</Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link href="#deets">Sign in</Nav.Link>
            <Nav.Link >Sign up </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
