import React from "react";
import { Button } from "react-bootstrap";
import { Thread, Post } from "../../types";

const Threads = (props: {
  threads: Thread[];
  posts: Post[];
  selectThread: (id: number) => void;
}) => {
  const { selectThread, threads, posts } = props;
  return (
    <div className="overflow-auto" style={{ height: "90%" }}>
      <div className="box d-flex flex-column">
        {threads.map((t) => (
          <Button
            variant="dark"
            className="btn-sm m-1"
            key={t.id}
            onClick={() => selectThread(t.id)}
          >
            {t.title} ({posts.filter((p) => p.threadId === t.id).length})
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Threads;
