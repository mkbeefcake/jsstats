import React from "react";
import { Button, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Sliders } from "react-feather";

const NavBar = (props: any) => {
  const { authors } = props;

  return (
    <Navbar bg="dark" variant="dark">
      <Link to="/">
        <Navbar.Brand>Joystream</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Brand className="mr-auto">Proposals</Navbar.Brand>

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
