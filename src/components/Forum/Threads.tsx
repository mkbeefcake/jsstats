import React from "react";
//import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Thread, Post } from "../../types";

const Threads = (props: {
  threads: Thread[];
  posts: Post[];
  selectThread: (id: number) => void;
}) => {
  const { selectThread, threads, posts } = props;
  return (
    <div>
      {threads.map((t) => (
        <div key={t.id} onClick={() => selectThread(t.id)}>
          {t.title} ({posts.filter((p) => p.threadId === t.id).length})
        </div>
      ))}
    </div>
  );
};

export default Threads;
