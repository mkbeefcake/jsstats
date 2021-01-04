import React from "react";
import { Member, ProposalDetail, ProposalPost } from "../../types";
import Loading from "..//Loading";
import ProposalTable from "./ProposalTable";
import Back from "../Back";

const Proposals = (props: {
  now: number;
  block: number;
  proposals: ProposalDetail[];
  proposalPosts: ProposalPost[];
  members: Member[];
}) => {
  const { proposalPosts, block, now, members } = props;
  const startTime: number = now - block * 6000;

  // prepare proposals

  //  - remove empty
  const proposals = props.proposals
    .filter((p) => p)
    .sort((a, b) => b.id - a.id);

  // - communicate loading state
  if (!proposals.length)
    return (
      <div className="box">
        <h1>Loading</h1>
        <Loading />
      </div>
    );

  // - calculate blocks until finalized
  const durations: any = proposals.map((p) =>
    p.finalizedAt ? p.finalizedAt - p.createdAt : 0
  );

  // - calculate mean voting duration
  const avgBlocks =
    durations.reduce((a: number, b: number) => a + b) / durations.length;
  const avgDays = avgBlocks ? Math.floor(avgBlocks / 14400) : 0;
  const avgHours = avgBlocks
    ? Math.floor((avgBlocks - avgDays * 14400) / 600)
    : 0;

  // - list all proposals
  return (
    <div className="w-100 h-100 overflow-hidden bg-light text-center">
      <Back />
      <h1>Joystream Proposals</h1>
      <ProposalTable
        avgDays={avgDays}
        avgHours={avgHours}
        block={block}
        members={members}
        proposals={proposals}
        proposalPosts={proposalPosts}
        startTime={startTime}
      />
    </div>
  );
};

export default Proposals;
