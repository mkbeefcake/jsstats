import React from "react";
import { Link } from "react-router-dom";
import User from "../User";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import moment from "moment";
import { domain } from "../../config";

import { Handles, Thread, Post } from "../../types";

const LatestPost = (props: {
  selectThread: (id: number) => void;
  handles: Handles;
  post: Post;
  thread?: Thread;
  startTime: number;
}) => {
  const { selectThread, handles = [], thread, post, startTime } = props;
  const { authorId, createdAt, id, threadId, text, handle } = post;

  return (
    <div
      key={id}
      className="box d-flex flex-row"
      onClick={
        thread && selectThread ? () => props.selectThread(thread.id) : () => {}
      }
    >
      <div className="col-2 mr-3">
        <User key={authorId} id={authorId} handle={handles[authorId]} />
        <div>{moment(startTime + createdAt.block * 6000).fromNow()}</div>
        <a href={`${domain}/#/forum/threads/${threadId}`}>reply</a>
      </div>

      <div>
        <div className="text-left mb-3 font-weight-bold">
          <Link to={`/forum/threads/${threadId}`}>
            {thread ? thread.title : threadId}
          </Link>
        </div>

        <Markdown
          plugins={[gfm]}
          className="overflow-auto text-left"
          children={text.slice(0, 200) + `...`}
        />
      </div>
    </div>
  );
};

export default LatestPost;
