import React from "react";
import { Link } from "react-router-dom";
import { Member, Post, ProposalDetail } from "../../types";
import { domain } from "../../config";
import moment from "moment";

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
  startTime: number;
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
  const council = councils[councils.length - 1];
  if (!council) return <div>Loading..</div>;
  const isCouncilMember = council.includes(id);
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

  const time = props.startTime + member.registeredAt * 6000;
  const date = moment(time);
  const created = date.isValid()
    ? date.format("DD/MM/YYYY HH:mm")
    : member.registeredAt;

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
        <div>
          Registered on {created} (id {member.id})
        </div>
        <OnCouncil onCouncil={onCouncil.length} votes={votes.length} />
        <Proposals proposals={createdProposals.length} />
        <Posts posts={posts.length} />

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

const Proposals = (props: { proposals: number }) => {
  const { proposals } = props;
  if (!proposals) return <div />;
  const count = proposals > 1 ? `proposals` : `proposal`;
  return (
    <div>
      Authored <Link to={`/proposals`}>{proposals}</Link> {count}.
    </div>
  );
};

const Posts = (props: { posts: number }) => {
  if (!props.posts) return <div />;
  const count = props.posts > 1 ? `posts` : `post`;
  return (
    <div>
      Wrote <Link to={`/forum`}>{props.posts}</Link> forum {count}.
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
        Voted on proposals:{" "}
        <Link to={`/councils`}>{votes > 1 ? `${votes} times` : "once"}</Link>
      </div>
    </div>
  );
};

// <div>Account: {member.account}</div>

export default MemberBox;
