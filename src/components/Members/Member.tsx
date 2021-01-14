import React from "react";
import { Member, Post, ProposalDetail, Seat } from "../../types";
import { Link } from "react-router-dom";
import { Badge, ListGroup } from "react-bootstrap";
import { domain } from "../../config";
import Summary from "./Summary";
import Loading from "../Loading";
import NotFound from "./NotFound";
import Back from "../Back";
import moment from "moment";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

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
  if (!council) return <Loading />;
  const isCouncilMember = council.find(
    (seat) => seat.member === member.account
  );
  const startTime = now - block * 6000;

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

      <Proposals
        proposals={proposals.filter((p) => p && p.authorId === member.id)}
        startTime={startTime}
      />

      <Posts
        posts={posts.filter((p) => p.authorId === member.account)}
        startTime={startTime}
      />
    </div>
  );
};

const Posts = (props: { posts: Post[]; startTime: number }) => {
  const { posts, startTime } = props;

  if (!posts.length) return <div />;

  return (
    <div className="mt-3">
      <h3 className="text-center text-light">Latest Posts</h3>
      {posts
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)
        .map((p) => (
          <div key={p.id} className="box d-flex flex-row">
            <div className="mr-3">
              <div>
                {moment(startTime + p.createdAt.block * 6000).fromNow()}
              </div>
              <a href={`${domain}/#/forum/threads/${p.threadId}`}>reply</a>
            </div>
            <Markdown
              plugins={[gfm]}
              className="overflow-auto text-left"
              children={p.text}
            />
          </div>
        ))}
    </div>
  );
};

const Proposals = (props: {
  proposals: ProposalDetail[];
  startTime: number;
}) => {
  const { proposals, startTime } = props;

  if (!proposals.length) return <div />;

  return (
    <div className="mt-3">
      <h3 className="text-center text-light">Latest Proposals</h3>
      <ListGroup className="box">
        {proposals
          .sort((a, b) => b.id - a.id)
          .slice(0, 5)
          .map((p) => (
            <ListGroup.Item key={p.id} className="box bg-secondary">
              <Link to={`/proposals/${p.id}`}>
                <Badge
                  className="mr-2"
                  variant={
                    p.result === "Approved"
                      ? "success"
                      : p.result === "Pending"
                      ? "warning"
                      : "danger"
                  }
                >
                  {p.result}
                </Badge>
                {p.title}, {moment(startTime + p.createdAt * 6000).fromNow()}
              </Link>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
};

export default MemberBox;
