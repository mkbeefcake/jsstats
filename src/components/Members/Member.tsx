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

        <div>Registered at block: {member.registeredAt}</div>
        <OnCouncil onCouncil={onCouncil.length} votes={votes.length} />
        <div>
          Proposals authored:{" "}
          <Link to={`/proposals`}>{createdProposals.length}</Link>
        </div>
        <div>
          Posts: <Link to={`/forum`}>{posts.length}</Link>
        </div>

        <About about={member.about} />
      </div>
    </div>
  );
};

const About = (props: { about: string }) => {
  if (props.about === ``) return <div />;
  return (
    <div className="mt-3" style={{ maxWidth: "320px" }}>
      About: {props.about}
    </div>
  );
};

const OnCouncil = (props: { onCouncil: number; votes: number }) => {
  const { onCouncil, votes } = props;
  if (!onCouncil) return <div />;
  return (
    <div>
      <div>
        Council member:{" "}
        <Link to={`/councils`}>
          {onCouncil > 1 ? `${onCouncil} times` : "once"}
        </Link>
      </div>
      <div>
        Proposal votes: <Link to={`/councils`}>{votes}</Link>
      </div>
    </div>
  );
};

// <div>Account: {member.account}</div>

export default MemberBox;
