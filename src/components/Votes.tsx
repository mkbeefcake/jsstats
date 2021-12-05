import React from "react";
import { Button } from "react-bootstrap";
import { Vote } from "../types";

export const voteKeys: { [key: string]: string } = {
  abstensions: "Abstain",
  approvals: "Approve",
  rejections: "Reject",
  slashes: "Slash",
};

export const voteStyles: { [key: string]: string } = {
  Abstain: "secondary",
  Approve: "success",
  Reject: "danger",
  Slash: "warning",
  "": "body",
};

export const VoteButton = (props: { handle: string; vote: string }) => {
  const { handle, vote } = props;
  return (
    <Button title={vote} className="btn-sm p-1" variant={voteStyles[vote]}>
      {handle}
    </Button>
  );
};

// Vote!

export const VoteNowButton = (props: { show: boolean; url: string }) => {
  const { show, url } = props;
  if (!show) return <div />;

  return (
    <Button variant="success">
      <a href={url}>Vote</a>
    </Button>
  );
};

// Bubbles

const VoteBubble = (props: {
  detailed?: boolean;
  vote: Vote;
  count: number;
}) => {
  const { detailed, vote } = props;
  if (!vote.member) return <div />;
  const handle = vote.member.handle;
  return (
    <Button className="btn-sm p-1" variant={voteStyles[vote.vote]}>
      <a href={`/members/${handle}`}>
        {handle} {detailed && vote.vote}
      </a>
    </Button>
  );
};

export const VotesBubbles = (props: { detailed?: boolean; votes: Vote[] }) => {
  const votes = props.votes.reduce(
    (uniq, vote) =>
      uniq.find((v) => v.member.handle === vote.member.handle)
        ? uniq
        : uniq.concat(vote),
    []
  );
  return (
    <>
      {votes.map((vote: Vote) => (
        <VoteBubble
          key={vote.id}
          detailed={props.detailed}
          vote={vote}
          count={votes.length}
        />
      ))}
    </>
  );
};

// Tooltip

//interface IProps {
//  votes: VotingResults;
//  votesByAccount?: Vote[];
//}
// TODO Property 'votes' does not exist on type 'IntrinsicAttributes & IProps'
// https://stackoverflow.com/questions/59969756/not-assignable-to-type-intrinsicattributes-intrinsicclassattributes-react-js

export const VotesTooltip = (props: any) => {
  const { votes } = props;
  if (!votes)
    return (
      <div>
        <VotesBubbles detailed={true} votes={votes} />
      </div>
    );

  if (!votes.length) return <div>No votes were cast.</div>;

  return (
    <div className="text-left text-light">
      {votes.map((vote: Vote) => (
        <VoteButton
          key={vote.member.handle}
          handle={vote.member.handle}
          vote={vote.vote}
        />
      ))}
    </div>
  );
};
