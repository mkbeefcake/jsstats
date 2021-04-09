import React from "react";
import { Link } from "react-router-dom";
import LatestPost from "../Forum/LatestPost";
import Loading from "../Loading";

import { Handles, Post, Thread } from "../../types";

const Forum = (props: {
  handles: Handles;
  posts: Post[];
  threads: Thread[];
}) => {
  const { handles, posts, threads, startTime } = props;
  if (!posts.length) return <Loading target="posts" />;
  return (
    <div className="w-100 p-3 m-3 d-flex flex-column">
      <h3>
        <Link className="text-light" to={"/forum"}>
          Forum
        </Link>
      </h3>
      {props.posts
        .sort((a, b) => b.id - a.id)
        .slice(0, 10)
        .map((post) => (
          <LatestPost
            key={post.id}
            selectThread={() => {}}
            handles={handles}
            post={post}
            thread={threads.find((t) => t.id === post.threadId)}
            startTime={startTime}
          />
        ))}
    </div>
  );
};

export default Forum;
