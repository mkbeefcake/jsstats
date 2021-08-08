import React from "react";
import { Button, Navbar, NavDropdown } from "react-bootstrap";
import { Sliders } from "react-feather";

const NavBar = (props: any) => {
  const { authors, show } = props;
  if (!show) return <div />;
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Brand className="mr-auto">Proposals</Navbar.Brand>

        <NavDropdown
          title={<div className="text-light">per Page</div>}
          id="basic-nav-dropdown"
        >
          <NavDropdown.Divider />
          {[10, 25, 50, 100, 250, 500].map((n) => (
            <NavDropdown.Item key={n} onClick={() => props.setPerPage(n)}>
              {n}
            </NavDropdown.Item>
          ))}
        </NavDropdown>

        <NavDropdown
          title={<div className="text-light">Creator</div>}
          id="basic-nav-dropdown"
        >
          <NavDropdown.Item
            className={"All" === props.author ? "bg-dark text-light" : ""}
            onClick={props.selectAuthor}
            value=""
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
              {authors[author]}
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
