import React from "react";
import { Member, Post, ProposalDetail, Seat } from "../../../types";
import { domain } from "../../../config";

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
  councils: Seat[][];
  handle: string;
  member: Member;
  posts: Post[];
  proposals: ProposalDetail[];
  startTime: number;
  validators: string[];
}) => {
  const { councils, handle, member, proposals, startTime } = props;

  const onCouncil = councils.filter((c) =>
    c && c.find((seat) => seat.member === member.account)
  );

  let votes: ProposalVote[] = [];
  proposals.forEach((p) => {
    if (!p || !p.votesByAccount) return;
    const vote = p.votesByAccount.find((v) => v.handle === member.handle);
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

  const runsValidator = props.validators.includes(member.account);

  return (
    <div className="text-left">
      <div>
        Registered on {created} (id {member.id})
      </div>

      {runsValidator && (
        <div>
          This user runs a <a href={`${domain}/#/staking`}>validator node</a>.
        </div>
      )}

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
