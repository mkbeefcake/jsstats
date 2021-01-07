import React from "react";
import User from "../User";
import { Handles } from "../../types";
import moment from "moment";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

const formatTime = (time: number) => {
  return moment(time).format("DD/MM/YYYY HH:mm");
};

const PostBox = (props: {
  startTime: number;
  handles: Handles;
  id: number;
  authorId: string;
  createdAt: { block: number; time: number };
  text: string;
}) => {
  const { createdAt, startTime, id, authorId, handles, text } = props;
  const created = formatTime(startTime + createdAt.block * 6000);

  return (
    <div className="box" key={id}>
      <div className="float-right">{created}</div>
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
