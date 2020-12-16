import React from "react";
import { Member, ProposalPost, Vote } from "../../types";
import { ProposalParameters, VotingResults } from "@joystream/types/proposals";
import { Button, OverlayTrigger, Tooltip, Table } from "react-bootstrap";
import Bar from "./Bar";
import Posts from "./Posts";
import moment from "moment";

const formatTime = (time: number) => {
  return moment(time).format("DD/MM/YYYY HH:mm");
};

const colors: { [key: string]: string } = {
  Approved: "bg-success text-light",
  Rejected: "bg-danger text-light",
  Canceled: "bg-danger text-light",
  Expired: "bg-warning text-dark",
  Pending: "",
};

const VotesTooltip = (props: {
  getHandle: (id: number) => string;
  votes?: Vote[];
}) => {
  const { getHandle } = props;
  let votes;

  if (props.votes)
    votes = props.votes.filter((v) => (v.vote === `` ? false : true));
  if (!votes) return <div>Fetching votes..</div>;
  if (!votes.length) return <div>No votes yet.</div>;

  return (
    <Table className="text-left text-light">
      <tbody>
        {votes.map((v: { memberId: number; vote: string }) => (
          <tr key={`vote-${v.memberId}`}>
            <td>{getHandle(v.memberId)}:</td>
            <td>{v.vote}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const ProposalRow = (props: {
  block: number;
  createdAt: number;
  finalizedAt: number;
  startTime: number;
  description: string;
  id: number;
  parameters: ProposalParameters;
  exec: boolean;
  result: string;
  stage: string;
  title: string;
  type: string;
  votes: VotingResults;
  members: Member[];
  posts: ProposalPost[];
  votesByMemberId?: Vote[];
}) => {
  const {
    block,
    createdAt,
    description,
    finalizedAt,
    id,
    title,
    type,
    votes,
    members,
  } = props;

  const url = `https://pioneer.joystreamstats.live/#/proposals/${id}`;
  let result: string = props.result ? props.result : props.stage;
  if (props.exec) result = "Executing";
  const color = colors[result];

  const created = formatTime(props.startTime + createdAt * 6000);
  const finalized =
    finalizedAt && formatTime(props.startTime + finalizedAt * 6000);

  const period = +props.parameters.votingPeriod;

  let blocks = finalizedAt ? finalizedAt - createdAt : block - createdAt;
  //if (blocks < 0) blocks = 0; // TODO make sure block is defined
  const days = blocks ? Math.floor(blocks / 14400) : 0;
  const hours = blocks ? Math.floor((blocks - days * 14400) / 600) : 0;
  const daysStr = days ? `${days}d` : "";
  const hoursStr = hours ? `${hours}h` : "";
  const duration = blocks ? `${daysStr} ${hoursStr} / ${blocks} blocks` : "";

  const getHandle = (memberId: number): string => {
    const member = members.find((m) => m.id === memberId);
    return member ? member.handle : String(memberId);
  };

  return (
    <tr key={id}>
      <td>{id}</td>

      <td className="text-right">
        <Posts posts={props.posts} />
        <OverlayTrigger
          key={id}
          placement="right"
          overlay={<Tooltip id={String(id)}>{description}</Tooltip>}
        >
          <a href={url}>
            {title} ({type})
          </a>
        </OverlayTrigger>
      </td>

      <OverlayTrigger
        placement="left"
        overlay={
          <Tooltip id={`votes-${id}`}>
            <VotesTooltip getHandle={getHandle} votes={props.votesByMemberId} />
          </Tooltip>
        }
      >
        <td className={color}>
          <b>{result}</b>
          <br />
          {JSON.stringify(Object.values(votes))}
        </td>
      </OverlayTrigger>

      <td className="text-left  justify-content-center">
        <Bar id={id} blocks={blocks} period={period} duration={duration} />
      </td>

      <td className="text-right">{created}</td>
      <td className="text-left">
        {finalized || (
          <Button variant="danger">
            <a href={url}>Vote!</a>
          </Button>
        )}
      </td>
    </tr>
  );
};

export default ProposalRow;
