import React from "react";
import TimelineItem from "./Item";

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
        text: p.description,
        date: p.createdAt,
        category: {
          tag: `${p.result} Proposal`,
          color: p.result === `Approved` ? `green` : `red`,
        },
        link: {
          url: `/proposals/${p.id}`,
          text: `Proposal ${p.id}: ${p.title} by ${p.author.handle}`,
        },
      })
  );

  posts.forEach(
    (p) =>
      p &&
      events.push({
        text: p.text.slice(0, 200),
        date: p.createdAt.block,
        category: {
          tag: "Forum Post",
          color: `blue`,
        },
        link: {
          url: `/forum/threads/${p.threadId}`,
          text: `Post ${p.id} by ${p.author.handle}`,
        },
      })
  );

  if (!events.length) return <div />;

  return (
    <div className="timeline-container">
      {events
        .sort((a, b) => b.date - a.date)
        .map((event: Event, i) => (
          <TimelineItem event={event} key={i} startTime={status.startTime} />
        ))}
    </div>
  );
};

export default Timeline;
