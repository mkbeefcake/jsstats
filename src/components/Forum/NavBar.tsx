import React from "react";
import { Form, Nav, Navbar } from "react-bootstrap";

import { ChevronRight } from "react-feather";
import { Category, Thread } from "../../types";

const CategoryNav = (props: {
  selectThread: (id: number) => void;
  category?: Category;
}) => {
  if (!props.category) return <div />;
  return (
    <Navbar.Brand onClick={() => props.selectThread(0)}>
      <ChevronRight />
      {props.category.title}
    </Navbar.Brand>
  );
};

const ThreadNav = (props: { thread?: Thread }) => {
  if (!props.thread) return <div />;
  return (
    <Navbar.Brand>
      <ChevronRight />
      {props.thread.title}
    </Navbar.Brand>
  );
};

const NavBar = (props: {
  selectCategory: (id: number) => void;
  selectThread: (id: number) => void;
  getMinimal: (array: { id: number }[]) => any;
  category?: Category;
  thread?: Thread;
  searchTerm: string;
  handleChange: (e: any) => void;
}) => {
  const {
    selectCategory,
    selectThread,
    category,
    thread,
    searchTerm,
    handleChange,
  } = props;

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand
        onClick={() => {
          selectCategory(0);
          selectThread(0);
        }}
      >
        Forum
      </Navbar.Brand>
      <CategoryNav selectThread={selectThread} category={category} />
      <ThreadNav thread={thread} />

      <Nav className="ml-auto">
        <Form>
          <input
            type="search"
            name="searchTerm"
            value={searchTerm}
            placeholder="Search"
            className="bg-dark text-light "
            onChange={handleChange}
            //ref={(i) => i && i.focus()}
          />
        </Form>
      </Nav>
    </Navbar>
  );
};

export default NavBar;
