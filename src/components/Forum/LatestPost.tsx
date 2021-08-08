import React from "react";
import { Link } from "react-router-dom";
import User from "../User";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import moment from "moment";
import { domain } from "../../config";

import { Post } from "../../types";

const LatestPost = (props: {
  selectThread: (id: number) => void;
  post: Post;
  startTime: number;
}) => {
  const { selectThread, post, startTime } = props;
  const { author, createdAt, id, thread, text } = post;
  const created = moment(startTime + createdAt.block * 6000);
  return (
    <div
      key={id}
      className="box text-left"
      onClick={
        thread && selectThread ? () => props.selectThread(thread.id) : () => {}
      }
    >
      <div className="mb-2">
        {created.isValid() ? created.fromNow() : <span />}
        <User key={author.id} id={author.id} handle={author.handle} />
        posted in
        <Link
          to={`/forum/threads/${thread.id}`}
          className="font-weight-bold mx-2"
        >
          {thread ? thread.title : `Thread ${thread.id}`}
        </Link>
        <a href={`${domain}/#/forum/threads/${thread.id}`}>reply</a>
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
