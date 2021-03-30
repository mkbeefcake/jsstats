import React from "react";
import TimelineItem from "./Item";
import { Back } from "..";

import { Event, Post, ProposalDetail } from "../../types";

const Timeline = (props: {
  posts: Post[];
  proposals: ProposalDetail[];
  status: { startTime: number };
}) => {
  const { posts, proposals, status } = props;
  let events: Event[] = [];

  proposals.forEach(
    (p) =>
      p &&
      events.push({
        text: p.title,
        date: p.createdAt,
        category: {
          tag: "Proposal",
          color: p.result === `Approved` ? `green` : `red`,
        },
        link: {
          url: `/proposals/${p.id}`,
          text: `Proposal ${p.id}`,
        },
      })
  );

  posts.forEach(
    (p) =>
      p &&
      events.push({
        text: p.text.slice(0, 100),
        date: p.createdAt.block,
        category: {
          tag: "Forum Post",
          color: `blue`,
        },
        link: {
          url: `/forum/threads/${p.threadId}`,
          text: `Post ${p.id}`,
        },
      })
  );

  if (!events.length) return <div />;

  return (
    <div className="timeline-container">
      <div className="back left">
        <Back history={props.history} />
      </div>

      {events
        .sort((a, b) => b.date - a.date)
        .map((event: Event, idx) => (
          <TimelineItem event={event} key={idx} startTime={status.startTime} />
        ))}
    </div>
  );
};

export default Timeline;
