import React from "react";
import { Member, ProposalDetail, Post, ProposalPost, Seat } from "../../types";
import Loading from "..//Loading";
import ProposalTable from "./ProposalTable";

const Proposals = (props: {
  status: { startTime: number };
  proposals: ProposalDetail[];
  proposalPosts: ProposalPost[];
  members: Member[];

  // author overlay
  councils: Seat[][];
  posts: Post[];
  validators: string[];
}) => {
  const { proposalPosts, members, status } = props;

  // prepare proposals
  //  - remove empty
  const proposals = props.proposals
    .filter((p) => p)
    .sort((a, b) => b.id - a.id);

  // - communicate loading state
  if (!proposals.length)
    return (
      <div className="box">
        <Loading target="Proposals" />
      </div>
    );

  // - list all proposals
  return (
    <ProposalTable
      block={status.block.id}
      members={members}
      proposals={proposals}
      proposalPosts={proposalPosts}
      startTime={status.startTime}
      councils={props.councils}
      posts={props.posts}
      validators={props.validators}
    />
  );
};

export default Proposals;
