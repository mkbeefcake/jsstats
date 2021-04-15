import React from "react";
import TimelineItem from "./Item";
import { Back } from "..";

import { Event, Post, ProposalDetail } from "../../types";

const Timeline = (props: {
  posts: Post[];
  proposals: ProposalDetail[];
  status: { startTime: number };
}) => {
  const { handles, posts, proposals, status } = props;
  let events: Event[] = [];

  proposals.forEach(
    (p) =>
      p &&
      events.push({
        text: p.description,
        date: p.createdAt,
        category: {
          tag: "Proposal",
          color: p.result === `Approved` ? `green` : `red`,
        },
        link: {
          url: `/proposals/${p.id}`,
          text: `${p.title} by ${p.author}`,
        },
      })
  );

  posts.forEach(
    (p) =>
      p &&
      events.push({
        text: p.text,
        date: p.createdAt.block,
        category: { tag: "Forum Post", color: `blue` },
        link: {
          url: `/forum/threads/${p.threadId}`,
          text: `Post ${p.id} by ${handles[p.authorId]}`,
        },
      })
  );

  if (!events.length) return <div />;

  return (
    <>
      <div className="back">
        <Back history={props.history} />
      </div>

      <div className="timeline-container">
        {events
          .sort((a, b) => b.date - a.date)
          .map((event: Event, idx) => (
            <TimelineItem
              event={event}
              key={idx}
              startTime={status.startTime}
            />
          ))}
      </div>
    </>
  );
};

export default Timeline;
