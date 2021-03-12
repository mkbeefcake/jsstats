import React from "react";
import User from "../User";
import { Handles } from "../../types";
import { domain } from "../../config";
import moment from "moment";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

const PostBox = (props: {
  startTime: number;
  handles: Handles;
  id: number;
  authorId: string;
  createdAt: { block: number; time: number };
  text: string;
  threadId: number;
}) => {
  const { createdAt, startTime, id, authorId, handles, threadId } = props;
  const created = moment(startTime + createdAt.block * 6000).fromNow();
  const text = props.text
    .split("\n")
    .map((line) => line.replace(/>/g, "&gt;"))
    .join("\n\n");

  return (
    <div className="box" key={id}>
      <div className="float-right">
        <a href={`${domain}/#/forum/threads/${threadId}`}>reply</a>
      </div>
      <div className="float-left">{created}</div>
      <User key={authorId} id={authorId} handle={handles[authorId]} />
      <Markdown
        plugins={[gfm]}
        className="mt-1 overflow-auto text-left"
        children={text}
      />
    </div>
  );
};

export default PostBox;
