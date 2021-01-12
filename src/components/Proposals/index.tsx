import React from "react";
import { Member, ProposalDetail, Post, ProposalPost } from "../../types";
import Loading from "..//Loading";
import ProposalTable from "./ProposalTable";

const Proposals = (props: {
  now: number;
  block: number;
  proposals: ProposalDetail[];
  proposalPosts: ProposalPost[];
  members: Member[];

  // author overlay
  councils: number[][];
  posts: Post[];
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

  // - list all proposals
  return (
    <ProposalTable
      block={block}
      members={members}
      proposals={proposals}
      proposalPosts={proposalPosts}
      startTime={startTime}
      councils={props.councils}
      posts={props.posts}
    />
  );
};

export default Proposals;
