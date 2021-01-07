import React from "react";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap";

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

const ThreadNav = (props: {
  selectPost: (id: number) => void;
  thread?: Thread;
}) => {
  if (!props.thread) return <div />;
  return (
    <Navbar.Brand onClick={() => props.selectPost(0)}>
      <ChevronRight />
      {props.thread.title}
    </Navbar.Brand>
  );
};

const NavBar = (props: {
  selectCategory: (id: number) => void;
  selectThread: (id: number) => void;
  selectPost: (id: number) => void;
  getMinimal: (array: { id: number }[]) => any;
  categories: Category[];
  category?: Category;
  threads: Thread[];
  thread?: Thread;
  posts: Post[];
}) => {
  const {
    selectCategory,
    selectThread,
    selectPost,
    getMinimal,
    categories,
    threads,
    posts,
    category,
    thread,
  } = props;

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Joystream</Navbar.Brand>
      <Navbar.Brand onClick={() => selectCategory(0)}>Forum</Navbar.Brand>
      <CategoryNav selectThread={selectThread} category={category} />
      <ThreadNav selectPost={selectPost} thread={thread} />

      <Navbar.Brand>
        <Loading
          getMinimal={getMinimal}
          categories={categories}
          threads={threads}
          posts={posts}
        />
      </Navbar.Brand>
    </Navbar>
  );
};

export default NavBar;
