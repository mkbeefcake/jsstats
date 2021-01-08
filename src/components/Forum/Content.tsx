import React from "react";
import Categories from "./Categories";
import Threads from "./Threads";
import Posts from "./Posts";

import { Handles, Category, Thread, Post } from "../../types";

const Content = (props: {
  handles: Handles;
  categories: Category[];
  category?: Category;
  thread?: Thread;
  threads: Thread[];
  posts: Post[];
  selectCategory: (id: number) => void;
  selectThread: (id: number) => void;
  startTime: number;
  latest: { threads: number[]; categories: number[] };
}) => {
  const {
    selectCategory,
    selectThread,
    category,
    categories,
    threads,
    thread,
    posts,
    handles,
    startTime,
    latest,
  } = props;

  if (thread)
    return (
      <Posts
        thread={thread}
        posts={posts.filter((p) => p.threadId === thread.id)}
        handles={handles}
        startTime={startTime}
      />
    );

  if (category)
    return (
      <Threads
        latest={latest.threads}
        selectThread={selectThread}
        threads={threads.filter((t) => t.categoryId === category.id)}
        posts={posts}
      />
    );

  return (
    <Categories
      latest={latest.categories}
      selectCategory={selectCategory}
      categories={categories}
      threads={threads}
    />
  );
};
export default Content;
