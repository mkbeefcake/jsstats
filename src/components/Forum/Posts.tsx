import React from "react";
//import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ChevronLeft } from "react-feather";

import { Handles, Thread, Post } from "../../types";
import User from "../User";

const ThreadPosts = (props: {
  handles: Handles;
  thread?: Thread;
  posts: Post[];
  selectPost: (id: number) => void;
  selectThread: (id: number) => void;
}) => {
  const { selectPost, selectThread, thread, handles } = props;

  // unique posts
  let posts: Post[] = [];
  props.posts.forEach((p) => {
    if (!posts.find((post) => post.id === p.id)) posts.push(p);
  });

  if (!thread) return <div />;
  return (
    <div className="">
      {posts.map((p) => (
        <div className="box" key={p.id} onClick={() => selectPost(p.id)}>
          <User key={p.authorId} id={p.authorId} handle={handles[p.authorId]} />
          {p.text}
        </div>
      ))}
    </div>
  );
};

export default ThreadPosts;
