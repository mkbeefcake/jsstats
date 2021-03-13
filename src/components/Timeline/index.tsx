import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import TimelineItem from "./Item";
import { Event, Post, ProposalDetail } from "../../types";

const Timeline = (props: {
  posts: Post[];
  proposals: ProposalDetail[];
  block: number;
  now: number;
}) => {
  const { block, now, posts, proposals } = props;
  const startTime: number = now - block * 6000;
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
      <Link className="back left" to={"/"}>
        <Button variant="secondary">Back</Button>
      </Link>

      {events
        .sort((a, b) => b.date - a.date)
        .map((event: Event, idx) => (
          <TimelineItem event={event} key={idx} startTime={startTime} />
        ))}
    </div>
  );
};

export default Timeline;
