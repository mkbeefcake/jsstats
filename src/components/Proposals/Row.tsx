import React from "react";
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

const ProposalRow = (props: any) => {
  const { block, createdAt, description, finalizedAt, id, title, type } = props;

  const url = `https://pioneer.joystreamstats.live/#/proposals/${id}`;
  let result: string = props.result ? props.result : props.stage;
  if (props.exec) result = "Executing";
  const color = colors[result];

  const created = formatTime(props.startTime + createdAt * 6000);
  const finalized =
    finalizedAt && formatTime(props.startTime + finalizedAt * 6000);

  let { votingPeriod } = props.parameters;
  if (votingPeriod.toNumber) votingPeriod = votingPeriod.toNumber();

  let blocks = finalizedAt ? finalizedAt - createdAt : block - createdAt;
  //if (blocks < 0) blocks = 0; // TODO make sure block is defined
  const days = blocks ? Math.floor(blocks / 14400) : 0;
  const hours = blocks ? Math.floor((blocks - days * 14400) / 600) : 0;
  const daysStr = days ? `${days}d` : "";
  const hoursStr = hours ? `${hours}h` : "";
  const duration = blocks ? `${daysStr} ${hoursStr} / ${blocks} blocks` : "";

  const { abstensions, approvals, rejections, slashes } = props.votes;
  const votes = [abstensions, approvals, rejections, slashes];
  votes.map((o: number | { toNumber: () => number }) =>
    typeof o === "number" ? o : o.toNumber && o.toNumber()
  );

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
        overlay={
          <Tooltip id={id}>
            <div>
              {props.votesByMember ? (
                <Table className="text-left text-light">
                  <tbody>
                    {props.votesByMember.map(
                      (v: { handle: string; vote: string }) => (
                        <tr key={`${id}-${v.handle}`}>
                          <td>{v.handle}:</td>
                          <td>{v.vote}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              ) : (
                `Fetching votes..`
              )}
            </div>
          </Tooltip>
        }
      >
        <td className={color}>
          <b>{result}</b>
          <br />
          {votes.join(" / ")}
        </td>
      </OverlayTrigger>

      <td className="text-left  justify-content-center">
        <Bar
          id={id}
          blocks={blocks}
          period={votingPeriod}
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

export default ProposalRow;
