import React from "react";
import { Status } from "../../types";

const timeLeft = (blocks: number) => {
  const seconds = blocks * 6;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds - days * 86400) / 3600);
  const minutes = Math.floor(seconds / 60);
  return days ? `${days}d` : hours ? `${hours}h` : `${minutes}min`;
};

const ElectionStage = (props: {
  block: number;
  council: { stage; termEndsAt: number };
  domain: string;
}) => {
  const { block, council, domain } = props;
  if (!council) return <span>Loading..</span>;
  const { stage, termEndsAt } = council;

  if (!stage) {
    if (!block || !termEndsAt) return <span />;
    const left = timeLeft(termEndsAt - block);
    return <span>election starts in {left}</span>;
  }

  let stageString = Object.keys(stage)[0];
  const left = timeLeft(stage[stageString] - block);
  if (stageString === "announcing")
    return <a href={`${domain}/#/council/applicants`}>{left} to apply</a>;

  if (stageString === "voting")
    return <a href={`${domain}/#/council/applicants`}>{left} to vote</a>;

  if (stageString === "revealing")
    return <a href={`${domain}/#/council/votes`}>{left} to reveal votes</a>;

  return <span>{JSON.stringify(stage)}</span>;
};

const ElectionStatus = (props: { block; domain: string; status: Status }) => {
  const { domain, status } = props;
  if (!status.block || !status.council) return <div />;

  return (
    <div className="text-center text-white">
      <ElectionStage
        block={status.block.id}
        council={status.council}
        domain={domain}
      />
    </div>
  );
};

export default ElectionStatus;
