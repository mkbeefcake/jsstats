import React from "react";
import { Spinner } from "react-bootstrap";
import { ElectionStage } from "../../types";

const timeLeft = (blocks: number) => {
  const seconds = blocks * 6;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds - days * 86400) / 3600);
  const minutes = Math.floor(seconds / 60);
  return days ? `${days}d` : hours ? `${hours}h` : `${minutes}min`;
};

const Stage = (props: {
  block: number;
  stage: ElectionStage;
  domain: string;
}) => {
  const { block, stage, termEndsAt, domain } = props;

  if (!stage) {
    if (!block || !termEndsAt) return <span />;
    const left = timeLeft(termEndsAt - block);
    return <span>election starts in {left}</span>;
  }

  let stageString = Object.keys(stage)[0];
  const left = timeLeft(stage[stageString] - block);
  if (stageString === "announcing")
    return (
      <a style={{ color: "#fff" }} href={`${domain}/#/council/applicants`}>
        {left} to apply
      </a>
    );

  if (stageString === "voting")
    return (
      <a style={{ color: "#fff" }} href={`${domain}/#/council/applicants`}>
        {left} to vote
      </a>
    );

  if (stageString === "revealing")
    return (
      <a style={{ color: "#fff" }} href={`${domain}/#/council/votes`}>
        {left} to reveal votes
      </a>
    );

  return <span>{JSON.stringify(stage)}</span>;
};

const Election = (props: {
  block: number;
  domain: string;
  termEndsAt: number;
  stage: ElectionStage;
}) => {
  const { block, stage } = props;
  return (
    <div className="text-white float-right">
      {block && stage ? (
        <Stage {...props} />
      ) : (
        <Spinner animation="border" variant="dark" size="sm" />
      )}
    </div>
  );
};

export default Election;
