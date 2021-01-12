import React from "react";
import { Member, Post, ProposalDetail } from "../../types";
import { domain } from "../../config";
import Summary from "./Summary";
import NotFound from "./NotFound";
import Back from "../Back";

const MemberBox = (props: {
  match: { params: { handle: string } };
  members: Member[];
  councils: number[][];
  proposals: ProposalDetail[];
  posts: Post[];
  block: number;
  now: number;
}) => {
  const { block, now, councils, members, posts, proposals } = props;
  const handle = props.match.params.handle;
  const member = members.find(
    (m) => m.handle === handle || String(m.account) === handle
  );
  if (!member) return <NotFound />;

  const id = Number(member.id);
  const council = councils[councils.length - 1];
  if (!council) return <div>Loading..</div>;
  const isCouncilMember = council.includes(id);

  return (
    <div>
      <Back target="/members" />
      <div className="box">
        {isCouncilMember && <div>council member</div>}
        <a href={`${domain}/#/members/${handle}`}>
          <h1>{handle}</h1>
        </a>

        <Summary
          councils={councils}
          handle={handle}
          member={member}
          posts={posts}
          proposals={proposals}
          startTime={now - block * 6000}
        />
      </div>
    </div>
  );
};

export default MemberBox;
