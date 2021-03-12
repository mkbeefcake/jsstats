import React from "react";
import { Form, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import { ChevronRight } from "react-feather";
import { Category, Post, Thread } from "../../types";

import Loading from "./Loading";

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
  categories: Category[];
  category?: Category;
  threads: Thread[];
  thread?: Thread;
  posts: Post[];
  searchTerm: string;
  handleChange: (e: any) => void;
}) => {
  const {
    selectCategory,
    selectThread,
    getMinimal,
    categories,
    threads,
    posts,
    category,
    thread,
    searchTerm,
    handleChange,
  } = props;

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>
        <Link to="/">Joystream</Link>
      </Navbar.Brand>
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

      <Loading
        getMinimal={getMinimal}
        categories={categories}
        threads={threads}
        posts={posts}
      />
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
