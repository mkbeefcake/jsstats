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
  member: Member;
  posts: Post[];
  proposals: ProposalDetail[];
  startTime: number;
  validators: string[];
}) => {
  const { councils, member, proposals, startTime } = props;

  const onCouncil = councils?.filter((c) =>
    c?.consuls.find((c) => c.member.handle === member.handle)
  );

  let votes: ProposalVote[] = [];
  proposals.forEach((proposal) => {
    const vote = proposal.votes.find((v) => v.member.handle === member.handle);
    if (vote) votes.push({ proposal, vote });
  });
  const createdProposals = proposals.filter((p) => p?.author.handle === member.handle);
  const approved = createdProposals.filter((p) => p.result === "Approved");
  const pending = createdProposals.filter((p) => p.result === "Pending");
  const posts = props.posts.filter((p) => p.author.handle === member.handle);
  const created = moment(startTime + member.created * 6000)
  const runsValidator = props.validators.includes(member.account);

  return (
    <div className="text-left">
      <div>
        Registered on {created.format("DD-MM-YYYY")} (id {member.id})
      </div>

      {runsValidator && (
        <div>
          This user runs a <a href={`${domain}/#/staking`}>validator node</a>.
        </div>
      )}
     
      <Proposals
        proposals={createdProposals.length}
        approved={approved.length}
        pending={pending.length}
      />
      <Councils onCouncil={onCouncil.length} votes={votes.length} />
      <Posts posts={posts.length} />
      <About about={member.about} />
    </div>
  );
};
export default Summary;
