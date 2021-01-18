import React from "react";
import { domain } from "../../config";

const timeLeft = (blocks: number) => {
  const seconds = blocks * 6;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds - days * 86400) / 3600);
  const minutes = Math.floor(seconds / 60);
  return days ? `${days}d` : hours ? `${hours}h` : `${minutes}min`;
};

const ElectionStage = (props: {
  termEndsAt: number;
  block: number;
  stage: any;
}) => {
  const { block, stage, termEndsAt } = props;

  if (!stage) {
    if (!block || !termEndsAt) return <div />;
    const left = timeLeft(termEndsAt - block);
    return <div>election in {left}</div>;
  }

  //const stageObject = JSON.parse(JSON.stringify(stage));
  let stageString = Object.keys(stage)[0];
  const left = timeLeft(stage[stageString] - block);

  if (stageString === "Announcing")
    return <a href={`${domain}/#/council/applicants`}>{left} to apply</a>;

  if (stageString === "Voting")
    return <a href={`${domain}/#/council/applicants`}>{left} to vote</a>;

  if (stageString === "Revealing")
    return <a href={`${domain}/#/council/votes`}>{left} to reveal votes</a>;

  return <div>{JSON.stringify(stage)}</div>;
};

const ElectionStatus = (props: {
  councilElection?: { termEndsAt: number; round: number; stage: any };
  block: number;
  show: boolean;
  stage: any;
  termEndsAt: number;
}) => {
  const { councilElection, block, termEndsAt, show, stage } = props;
  if (!show) return <div />;
  return (
    <div className="position-absolute text-left text-light">
      <ElectionStage
        stage={stage}
        termEndsAt={termEndsAt}
        block={block}
        {...councilElection}
      />
    </div>
  );
};

export default ElectionStatus;
