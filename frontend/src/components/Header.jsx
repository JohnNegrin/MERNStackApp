import {Navbar, Nav, Container} from 'react-bootstrap';
import {FaShoppingCart, FaUser} from 'react-icons/fa';
import logo from '../assets/logo.png'

import React from 'react'

const Header = () => {
  return (
    <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
            <Container>
                <Navbar.Brand href="/">
                    <img src ={logo} alt='El Bodega'/> El Bodega
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-nvabar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/cart">
                            <FaShoppingCart /> Cart 
                        </Nav.Link>
                        <Nav.Link href="/login">
                            <FaUser /> Sign In 
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}
export default Header