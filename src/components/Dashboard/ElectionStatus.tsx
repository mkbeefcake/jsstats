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
  election: ElectionStage;
  domain: string;
}) => {
  const { block, election, domain } = props;
  const { stage, termEndsAt } = election;

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
  council: Council;
}) => {
  const { domain, election, block } = props;

  return (
    <div className="text-white float-right">
      {block && election ? (
        <Stage block={block} election={election} domain={domain} />
      ) : (
        <Spinner animation="border" variant="dark" size="sm" />
      )}
    </div>
  );
};

export default Election;
