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
  const { authorId, createdAt, id, threadId, text } = post;

  return (
    <div
      key={id}
      className="box text-left"
      onClick={
        thread && selectThread ? () => props.selectThread(thread.id) : () => {}
      }
    >
      <div className="mb-2">
        {moment(startTime + createdAt.block * 6000).fromNow()}
        <User key={authorId} id={authorId} handle={handles[authorId]} />
        posted in
        <Link
          to={`/forum/threads/${threadId}`}
          className="font-weight-bold mx-2"
        >
          {thread ? thread.title : `Thread ${threadId}`}
        </Link>
        <a href={`${domain}/#/forum/threads/${threadId}`}>reply</a>
      </div>

      <div className="overflow-hidden">
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
