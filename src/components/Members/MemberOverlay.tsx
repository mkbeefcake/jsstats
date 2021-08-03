import React from "react";
import { Member, Post, ProposalDetail, Seat } from "../../types";
import { domain } from "../../config";
import Summary from "./Summary";
import NotFound from "./NotFound";

const MemberBox = (props: {
  handle: string;
  members: Member[];
  councils: Seat[][];
  proposals: ProposalDetail[];
  posts: Post[];
  startTime: number;
  validators: string[];
}) => {
  const { councils, handle, members, posts, proposals, startTime } = props;
  const member = members.find((m) => m.handle === handle);
  if (!member) return <NotFound nolink={true} />;

  const council = councils[councils.length - 1];
  if (!council) return <div>Loading..</div>;
  const isCouncilMember = council.find(
    (seat) => seat.member === member.account
  );

  return (
    <div style={{backgroundColor: '#4038FF', padding: 5}}>
      {isCouncilMember && <div>council member</div>}
      <a href={`${domain}/#/members/${handle}`}>
        <h3>{handle}</h3>
      </a>

      <Summary
        councils={councils}
        handle={handle}
        member={member}
        posts={posts}
        proposals={proposals}
        startTime={startTime}
        validators={props.validators}
      />
    </div>
  );
};

export default MemberBox;
