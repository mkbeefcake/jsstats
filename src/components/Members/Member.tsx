import React from "react";
import { Link } from "react-router-dom";
import { Member, Post, ProposalDetail } from "../../types";
import { domain } from "../../config";

interface Vote {
  proposal: ProposalDetail;
  vote: string;
}

const NotFound = () => {
  return (
    <div className="box">
      <div> Member not found</div>
      <Link to={`/members`}>Back</Link>
    </div>
  );
};

const MemberBox = (props: {
  match?: { params: { handle: string } };
  handle?: string;
  members: Member[];
  councils: number[][];
  proposals: ProposalDetail[];
  posts: Post[];
}) => {
  const { councils, members, proposals } = props;
  const handle = props.handle
    ? props.handle
    : props.match
    ? props.match.params.handle
    : `?`;
  const member = members.find((m) => m.handle === handle);
  if (!member) return <NotFound />;

  const id = Number(member.id);
  const isCouncilMember = councils[councils.length - 1].includes(id);
  const onCouncil = councils.filter((c) => c.includes(Number(member.id)));

  let votes: Vote[] = [];
  proposals.forEach((p) => {
    if (!p || !p.votesByMemberId) return;
    const vote = p.votesByMemberId.find((v) => v.memberId === id);
    if (vote && vote.vote !== ``) votes.push({ proposal: p, vote: vote.vote });
  });
  const createdProposals = proposals.filter((p) => p && p.author === handle);

  const posts = props.posts.filter(
    (p) => p.authorId === String(member.account)
  );

  return (
    <div className="box">
      {props.match && (
        <Link className="float-left" to={"/members"}>
          back
        </Link>
      )}
      {isCouncilMember && <div>council member</div>}
      <a href={`${domain}/#/members/${handle}`}>
        <h1>{handle}</h1>
      </a>

      <div className="text-left">
        <div>Id: {member.id}</div>
        <div>Account: {member.account}</div>
        <div>Registered at block: {member.registeredAt}</div>

        <div>Council member: {onCouncil.length} times</div>
        <div>
          Proposal votes: <Link to={`/councils`}>{votes.length}</Link>
        </div>
        <div>
          Created Proposals:{" "}
          <Link to={`/proposals`}>{createdProposals.length}</Link>
        </div>
        <div>
          Posts: <Link to={`/forum`}>{posts.length}</Link>
        </div>

        <div>About: {member.about}</div>
      </div>
    </div>
  );
};

export default MemberBox;
