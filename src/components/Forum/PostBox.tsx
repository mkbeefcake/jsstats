import React from "react";
import User from "../User";
import { domain } from "../../config";
import moment from "moment";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

const PostBox = (props: {
  startTime: number;
  id: number;
  authorId: string;
  createdAt: { block: number; time: number };
  text: string;
  threadId: number;
}) => {
  const { createdAt, startTime, id, authorId, handle, threadId, text } = props;
  const created = moment(startTime + createdAt * 6000);
  return (
    <div className="box" key={id}>
      <div>
        <div className="float-right">
          <a href={`${domain}/#/forum/threads/${threadId}`}>reply</a>
        </div>
        <div className="float-left">
          {created.isValid() ? created.fromNow() : <span />}
        </div>
        <User key={authorId} id={authorId} handle={handle} />
      </div>
      <Markdown
        plugins={[gfm]}
        className="mt-1 overflow-auto text-left"
        children={text}
      />
    </div>
  );
};

export default PostBox;
