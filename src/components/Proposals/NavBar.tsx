import React from "react";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap";

import { Sliders } from "react-feather";

const NavBar = (props: any) => {
  const { authors } = props;

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Joystream</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/proposals">Proposals</Nav.Link>
        </Nav>

        <NavDropdown
          title={<div className="text-light">Creator</div>}
          id="basic-nav-dropdown"
        >
          <NavDropdown.Item
            className={"All" === props.author ? "bg-dark text-light" : ""}
            onClick={props.selectAuthor}
          >
            All
          </NavDropdown.Item>
          <NavDropdown.Divider />
          {Object.keys(authors).map((author) => (
            <NavDropdown.Item
              key={author}
              className={author === props.author ? "bg-dark text-light" : ""}
              onClick={props.selectAuthor}
            >
              {author}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
        <Button
          onClick={props.toggleShowTypes}
          title="Filter By Proposal Type"
          variant="dark"
          className="btn-sm m-0 p-0"
        >
          <Sliders color="white" />
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
