import React from "react";
import { Member, Post, ProposalDetail, Seat } from "../../types";
import { domain } from "../../config";
import Summary from "./Summary";
import NotFound from "./NotFound";
import Back from "../Back";

const MemberBox = (props: {
  match: { params: { handle: string } };
  members: Member[];
  councils: Seat[][];
  proposals: ProposalDetail[];
  posts: Post[];
  block: number;
  now: number;
  validators: string[];
}) => {
  const { block, now, councils, members, posts, proposals } = props;
  const h = props.match.params.handle;
  const member = members.find(
    (m) => m.handle === h || String(m.account) === h || m.id === Number(h)
  );
  if (!member) return <NotFound />;

  const council = councils[councils.length - 1];
  if (!council) return <div>Loading..</div>;
  const isCouncilMember = council.find(
    (seat) => seat.member === member.account
  );

  return (
    <div>
      <Back target="/members" />
      <div className="box">
        {isCouncilMember && <div>council member</div>}
        <a href={`${domain}/#/members/${member.handle}`}>
          <h1>{member.handle}</h1>
          <span>{member.account}</span>
        </a>

        <Summary
          councils={councils}
          handle={member.handle}
          member={member}
          posts={posts}
          proposals={proposals}
          startTime={now - block * 6000}
          validators={props.validators}
        />
      </div>
    </div>
  );
};

export default MemberBox;
