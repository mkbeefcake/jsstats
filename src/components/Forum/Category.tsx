import React from "react";
//import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Category, Thread, Post } from "../../types";
import Threads from "./Threads";
import Posts from "./Posts";
import { ChevronLeft } from "react-feather";

const CategoryThreads = (props: {
  category?: Category;
  thread?: number;
  threads: Thread[];
  posts: Post[];
  selectCategory: (id: number) => void;
  selectThread: (id: number) => void;
  selectPost: (id: number) => void;
}) => {
  const {
    selectCategory,
    selectThread,
    selectPost,
    category,
    threads,
    thread,
    posts,
  } = props;
  if (!category) return <div />;

  return (
    <div>
      <h2>
        <ChevronLeft onClick={() => selectCategory(0)} />
        <div onClick={() => selectThread(0)}>{category.title}</div>
      </h2>
      {thread ? (
        <Posts
          selectPost={selectPost}
          selectThread={selectThread}
          thread={threads.find((t) => t.id === thread)}
          posts={posts.filter((p) => p.threadId === thread)}
        />
      ) : (
        <Threads selectThread={selectThread} threads={threads} posts={posts} />
      )}
    </div>
  );
};

export default CategoryThreads;
