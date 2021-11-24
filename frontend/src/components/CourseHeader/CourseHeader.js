import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

export default function CourseHeader(props) {
  return (
    <Navbar collapseOnSelect expand="lg" color="black" bg="variant">
      <Container>
        <Navbar.Brand href="/dashboard" style={{fontWeight: 'bold'}}>Dashboard</Navbar.Brand>
        <Nav>
          <Nav.Link href={`/u/${props.user.accountId}`} style={{fontWeight: 'bold'}}>{props.user.username} </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
