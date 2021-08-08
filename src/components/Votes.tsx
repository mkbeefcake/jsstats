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
    <Button title={vote} className="m-1" variant={voteStyles[vote]}>
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

  return (
    <Button className="btn-sm m-1" variant={voteStyles[vote.vote]}>
      {vote.member.handle} {detailed && vote.vote}
    </Button>
  );
};

export const VotesBubbles = (props: { detailed?: boolean; votes: Vote[] }) => {
  const { detailed, votes } = props;

  return (
    <div>
      {votes.map((vote: Vote) => (
        <VoteBubble
          key={vote.id}
          detailed={detailed}
          vote={vote}
          count={votes.length}
        />
      ))}
    </div>
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
  const { votesByAccount } = props;
  if (!votesByAccount)
    return (
      <div>
        Fetching votes..
        <VotesBubbles detailed={true} votes={props.votes} />
      </div>
    );

  const votes = votesByAccount.filter((v: Vote) =>
    v.vote === `` ? false : true
  );
  if (!votes.length) return <div>No votes were cast yet.</div>;

  return (
    <div className="text-left text-light">
      {votes.map((vote: Vote) => (
        <VoteButton key={vote.handle} {...vote} />
      ))}
    </div>
  );
};
