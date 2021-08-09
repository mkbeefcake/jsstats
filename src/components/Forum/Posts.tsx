import React from "react";
import { Thread, Post } from "../../types";
import PostBox from "./PostBox";

const Posts = (props: {
  startTime: number;
  thread?: Thread;
  posts: Post[];
}) => {
  const { startTime, posts } = props;

  return (
    <div className="overflow-auto" style={{ height: `90%` }}>
      {posts
        .sort((a, b) => b.createdAt.block - a.createdAt.block)
        .map((post) => (
          <PostBox
            key={post.id}         
            startTime={startTime}
            {...post}
          />
        ))}
    </div>
  );
};

export default Posts;
