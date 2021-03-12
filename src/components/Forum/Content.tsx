import React from "react";
import Categories from "./Categories";
import Threads from "./Threads";
import Posts from "./Posts";
import LatestPost from "./LatestPost";

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
  latest: { threads: number[]; categories: number[]; posts: Post[] };
  searchTerm: string;
  filterPosts: (posts: Post[], s: string) => Post[];
  filterThreads: (list: any[], s: string) => any[];
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
    filterPosts,
    filterThreads,
  } = props;

  if (thread)
    return (
      <Posts
        thread={thread}
        posts={filterPosts(
          posts.filter((p) => p.threadId === thread.id),
          props.searchTerm
        )}
        handles={handles}
        startTime={startTime}
      />
    );

  if (category)
    return (
      <Threads
        latest={latest.threads}
        selectThread={selectThread}
        threads={filterThreads(
          threads.filter((t) => t.categoryId === category.id),
          props.searchTerm
        )}
        posts={posts}
      />
    );

  return (
    <div className="h-100">
      <Categories
        latest={latest.categories}
        selectCategory={selectCategory}
        categories={filterThreads(categories, props.searchTerm)}
        threads={threads}
      />
      {!latest.posts.length ? (
        <h2 className="text-center text-light my-2">Nothing found</h2>
      ) : (
          <div className="overflow-auto" style={{ height: "90%" }}>
            {latest.posts.map((p) => (
              <LatestPost
                key={p.id}
                selectThread={selectThread}
                startTime={startTime}
                handles={handles}
                thread={threads.find((t) => t.id === p.threadId)}
                post={p}
              />
            ))}
          </div>
      )}
    </div>
  );
};
export default Content;
