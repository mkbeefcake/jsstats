import React from "react";
import { Button, OverlayTrigger, Tooltip, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ProposalDetail } from "../../types";
import moment from "moment";
import Loading from "..//Loading";

const formatTime = (time: number) => {
  return moment(time).format("DD/MM/YYYY HH:mm");
};

const Proposals = (props: {
  now: number;
  block: number;
  proposals: ProposalDetail[];
}) => {
  const { block, now } = props;

  const proposals = props.proposals
    .filter((p) => p)
    .sort((a, b) => b.id - a.id);
  if (!proposals.length)
    return (
      <div className="box">
        <h1>Loading</h1>
        <Loading />
      </div>
    );

  const startTime: number[] = now - block * 6000;
  const durations: any = proposals.map((p) =>
    p.finalizedAt ? p.finalizedAt - p.createdAt : 0
  );

  const avgBlocks =
    durations.reduce((a: number, b: number) => a + b) / durations.length;
  const avgDays = avgBlocks ? Math.floor(avgBlocks / 14400) : 0;
  const avgHours = avgBlocks
    ? Math.floor((avgBlocks - avgDays * 14400) / 600)
    : 0;

  return (
    <div className="bg-light text-center">
      <Link to={`/`}>
        <Button variant="secondary" className="p-1 m-3">
          back
        </Button>
      </Link>
      <h1>Joystream Proposals</h1>
      <Table>
        <thead>
          <tr>
            <td>ID</td>
            <td className="text-right">Proposal</td>
            <td>Result</td>
            <td>
              Voting Duration
              <br />
              Average: {avgDays ? `${avgDays}d` : ""}{" "}
              {avgHours ? `${avgHours}h` : ""}
            </td>
            <td className="text-right">Created</td>
            <td className="text-left">Finalized</td>
          </tr>
        </thead>
        <tbody>
          {proposals.map((p) => (
            <ProposalRow
              key={p.id}
              startTime={startTime}
              block={block}
              {...p}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const Bar = (props: {
  id: number;
  blocks: number | null;
  duration: string;
  period: number;
}) => {
  const { blocks, duration, id, period } = props;
  const percent = blocks ? 100 * (blocks / period) : 0;
  return (
    <OverlayTrigger
      key={id}
      placement="right"
      overlay={
        <Tooltip id={String(id)}>
          {Math.floor(percent)}% of {period} blocks
          <br />
          {duration}
        </Tooltip>
      }
    >
      <div
        className="bg-dark mr-2"
        style={{ height: `30px`, width: `${percent}%` }}
      ></div>
    </OverlayTrigger>
  );
};

const colors: { [key: string]: string } = {
  Approved: "bg-success text-light",
  Rejected: "bg-danger text-light",
  Canceled: "bg-danger text-light",
  Expired: "bg-warning text-dark",
  Pending: "",
};

const ProposalRow = (props: any) => {
  const { block, createdAt, description, finalizedAt, id, title, type } = props;

  const url = `https://pioneer.joystreamstats.live/#/proposals/${id}`;
  let result: string = props.result ? props.result : props.stage;
  if (props.exec) result = "Executing";
  const color = colors[result];

  const created = formatTime(props.startTime + createdAt * 6000);
  const finalized =
    finalizedAt && formatTime(props.startTime + finalizedAt * 6000);

  let blocks = finalizedAt ? finalizedAt - createdAt : block - createdAt;
  if (blocks < 0) blocks = 0; // TODO make sure block is defined
  const days = blocks ? Math.floor(blocks / 14400) : 0;
  const hours = blocks ? Math.floor((blocks - days * 14400) / 600) : 0;
  const daysStr = days ? `${days}d` : "";
  const hoursStr = hours ? `${hours}h` : "";
  const duration = blocks ? `${daysStr} ${hoursStr} / ${blocks} blocks` : "";

  const { abstensions, approvals, rejections, slashes } = props.votes;
  const votes = [abstensions, approvals, rejections, slashes].map(
    (o) => o && o.toNumber()
  );

  return (
    <tr key={id}>
      <td>{id}</td>

      <td className="text-right">
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

      <td className={color}>
        <b>{result}</b>
        <br />
        {votes.join(" / ")}
      </td>
      <td className="text-left  justify-content-center">
        <Bar
          id={id}
          blocks={blocks}
          period={props.parameters.votingPeriod.toNumber()}
          duration={duration}
        />
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

export default Proposals;
