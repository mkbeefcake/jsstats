import React from "react";
import { ProposalTable } from "..";
import { Member, ProposalDetail, Post, Seat } from "../../types";

const Proposals = (props: {
  status: { startTime: number };
  proposals: ProposalDetail[];
  members: Member[];

  // author overlay
  councils: Seat[][];
  posts: Post[];
  validators: string[];
}) => {
  const {
    fetchProposals,
    posts,
    councils,
    members,
    status,
    validators,
  } = props;
  const { council, startTime } = status;

  // TODO put on state sorted, remove empty
  const proposals = props.proposals
    .filter((p) => p)
    .sort((a, b) => b.id - a.id);

  // - list all proposals
  return (
    <ProposalTable
      fetchProposals={fetchProposals}
      block={status.block.id}
      members={members}
      proposals={proposals}
      startTime={startTime}
      council={council}
      councils={councils}
      posts={posts}
      validators={validators}
      status={status}
    />
  );
};

export default Proposals;
