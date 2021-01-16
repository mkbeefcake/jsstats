import React from "react";
import { Button } from "react-bootstrap";
import { Thread, Post } from "../../types";

const Threads = (props: {
  threads: Thread[];
  posts: Post[];
  selectThread: (id: number) => void;
  latest: number[];
}) => {
  const { selectThread, threads, posts } = props;

  const getColor = (id: number) =>
    props.latest.includes(id) ? "bg-secondary" : "";

  return (
    <div className="overflow-auto" style={{ height: "90%" }}>
      <div className="box d-flex flex-column">
        {threads
          .sort((a, b) => b.id - a.id)
          .map((t) => (
            <Button
              variant="dark"
              className={`btn-sm m-1 ${getColor(t.id)}`}
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
