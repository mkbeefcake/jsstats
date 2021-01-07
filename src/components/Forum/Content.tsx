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
  post?: Post;
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
    categories,
    threads,
    thread,
    posts,
    post,
    handles,
  } = props;

  if (thread)
    return (
      <Posts
        selectPost={selectPost}
        selectThread={selectThread}
        thread={thread}
        posts={posts.filter((p) => p.threadId === thread.id)}
        handles={handles}
      />
    );

  if (category)
    return (
      <Threads
        //selectCategory={selectCategory}
        selectThread={selectThread}
        //selectPost={selectPost}
        //category={category}
        threads={threads.filter((t) => t.categoryId === category.id)}
        //thread={thread}
        posts={posts}
      />
    );

  return (
    <Categories
      selectCategory={selectCategory}
      categories={categories}
      threads={threads}
    />
  );
};
export default Content;
