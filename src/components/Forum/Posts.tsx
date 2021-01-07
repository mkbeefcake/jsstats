import React from "react";
import { Handles, Thread, Post } from "../../types";
import PostBox from "./PostBox";

const ThreadPosts = (props: {
  startTime: number;
  handles: Handles;
  thread?: Thread;
  posts: Post[];
}) => {
  const { thread, handles, startTime, posts } = props;

  if (!thread) return <div />;
  return (
    <div className="overflow-auto" style={{ height: `90%` }}>
      {posts.map((post) => (
        <PostBox
          key={post.id}
          handles={handles}
          startTime={startTime}
          {...post}
        />
      ))}
    </div>
  );
};

export default ThreadPosts;
