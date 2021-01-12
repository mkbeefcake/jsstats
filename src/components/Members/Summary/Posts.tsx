import React from "react";
import { Link } from "react-router-dom";

const Posts = (props: { posts: number }) => {
  const { posts } = props;
  if (!posts) return <div />;

  const post = posts > 1 ? `posts` : `post`;

  return (
    <div>
      Wrote <Link to={`/forum`}>{posts} forum {post}</Link>.
    </div>
  );
};

export default Posts;
