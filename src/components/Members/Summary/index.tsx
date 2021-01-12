import React from "react";
import { Member, Post, ProposalDetail } from "../../../types";

import About from "./About";
import Posts from "./Posts";
import Councils from "./Councils";
import Proposals from "./Proposals";

import moment from "moment";

interface ProposalVote {
  proposal: ProposalDetail;
  vote: string;
}

const Summary = (props: {
  councils: number[][];
  handle: string;
  member: Member;
  posts: Post[];
  proposals: ProposalDetail[];
  startTime: number;
}) => {
  const { councils, handle, member, proposals, startTime } = props;

  const onCouncil = councils.filter((c) => c.includes(member.id));

  let votes: ProposalVote[] = [];
  proposals.forEach((p) => {
    if (!p || !p.votesByMemberId) return;
    const vote = p.votesByMemberId.find((v) => v.memberId === member.id);
    if (vote && vote.vote !== ``) votes.push({ proposal: p, vote: vote.vote });
  });
  const createdProposals = proposals.filter((p) => p && p.author === handle);
  const approved = createdProposals.filter((p) => p.result === "Approved");
  const pending = createdProposals.filter((p) => p.result === "Pending");

  const posts = props.posts.filter((p) => p.authorId === member.account);

  const time = startTime + member.registeredAt * 6000;
  const date = moment(time);
  const created = date.isValid()
    ? date.format("DD/MM/YYYY HH:mm")
    : member.registeredAt;

  return (
    <div className="text-left">
      <div className="my-1">
        Registered on {created} (id {member.id})
      </div>

      <Councils onCouncil={onCouncil.length} votes={votes.length} />
      <Proposals
        proposals={createdProposals.length}
        approved={approved.length}
        pending={pending.length}
      />
      <Posts posts={posts.length} />
      <About about={member.about} />
    </div>
  );
};
export default Summary;
