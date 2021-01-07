import React from "react";
//import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Thread, Post } from "../../types";
import { ChevronLeft } from "react-feather";

const ThreadPosts = (props: {
  thread?: Thread;
  posts: Post[];
  selectPost: (id: number) => void;
  selectThread: (id: number) => void;
}) => {
  const { selectPost, selectThread, thread } = props;

  // unique posts
  let posts: Post[] = [];
  props.posts.forEach((p) => {
    if (!posts.find((post) => post.id === p.id)) posts.push(p);
  });

  if (!thread) return <div />;
  return (
    <div>
      <h4>
        <ChevronLeft onClick={() => selectThread(0)} />

        {thread.title}
      </h4>
      {posts.map((p) => (
        <div key={p.id} onClick={() => selectPost(p.id)}>
          {p.id}: {p.text}
        </div>
      ))}
    </div>
  );
};

export default ThreadPosts;
