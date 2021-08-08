import React from "react";
import { Council, Member, Post, ProposalDetail, Thread } from "../../types";
import { domain } from "../../config";
import Summary from "./Summary";
import Posts from "./MemberPosts";
import Proposals from "./MemberProposals";
import NotFound from "./NotFound";

const MemberBox = (props: {
  match: { params: { handle: string } };
  members: Member[];
  councils: Council[];
  proposals: ProposalDetail[];
  posts: Post[];
  threads: Thread[];
  validators: string[];
  history: any;
  status: { startTime: number };
}) => {
  const { councils, members, posts, proposals, status } = props;
  const h = props.match.params.handle;
  const member = members.find(
    (m) => m.handle === h || String(m.account) === h || m.id === Number(h)
  );
  if (!member) return <NotFound history={props.history} />;

  const council = status.council;
  const isCouncilMember = council?.consuls.find(
    (c) => c.member.handle === member.handle
  );

  const threadTitle = (id: number) => {
    const thread = props.threads.find((t) => t.id === id);
    return thread ? thread.title : String(id);
  };

  return (
    <div>
      <div className="box">
        {isCouncilMember && <div>council member</div>}
        <a href={`${domain}/#/members/${member.handle}`}>
          <h1>{member.handle}</h1>
          <span>{member.account}</span>
        </a>

        <Summary
          councils={councils}
          member={member}
          posts={posts}
          proposals={proposals}
          startTime={status.startTime}
          validators={props.validators}
        />
      </div>

      <Proposals
        proposals={proposals.filter((p) => p && p.authorId === member.id)}
        startTime={status.startTime}
      />

      <Posts
        posts={posts.filter((p) => p.authorId === member.account)}
        threadTitle={threadTitle}
        startTime={status.startTime}
      />
    </div>
  );
};

export default MemberBox;
