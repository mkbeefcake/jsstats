import React from "react";
import { ProposalDetail } from "../../types";

interface Vote {
  proposal: ProposalDetail;
  vote: string;
}

const Votes = (props: { votes: Vote[] }) => {
  const { votes } = props;
  if (!votes.length) return <div />;

  return (
    <div>
      <h2>Votes</h2>
      <div className="">
        {votes.map((v) => (
          <VoteDiv key={v.proposal.id} vote={v} />
        ))}
      </div>
    </div>
  );
};

const VoteDiv = (props: { vote: Vote }) => {
  const { proposal, vote } = props.vote;
  if (vote === "") return <div />;

  return (
    <div
      key={proposal.id}
      className={vote === `Approve` ? `bg-success` : `bg-danger`}
    >
      {proposal.title}
    </div>
  );
};

export default Votes