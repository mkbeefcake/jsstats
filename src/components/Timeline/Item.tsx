import React from "react";
import moment from "moment";
import { Event } from "../../types";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

const TimelineItem = (props: { event: Event; startTime: number }) => {
  const { category, date, text, link } = props.event;
  const time = moment().format;

  const formatTime = (time: number) => {
    return moment(time).format("DD/MM/YYYY HH:mm");
  };

  const created = formatTime(props.startTime + date * 6000);

  return (
    <div className="timeline-item">
      <div className="timeline-item-content">
        <span className="tag" style={{ background: category.color }}>
          {category.tag}
        </span>
        <time>{created}</time>
        <Markdown
          plugins={[gfm]}
          className="mt-1 overflow-auto text-left"
          children={String(text)}
        />

        <a href={link.url}> {link.text}</a>

        <span className="circle" />
      </div>
    </div>
  );
};

export default TimelineItem;
