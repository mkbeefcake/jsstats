import React from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import htmr from "htmr";

import { ProposalParameters } from "@joystream/types/proposals";

const ProposalOverlay = (props: {
  block: number;
  id: number;
  createdAt: number;
  parameters: ProposalParameters;
  title: string;
  message: string;
  description: string;
  result: string;
}) => {
  const { block, createdAt, text, parameters, result, title } = props;

  const remainingBlocks = +createdAt + +parameters.votingPeriod - block;
  const remainingTime = remainingBlocks * 6;
  const days = Math.floor(remainingTime / 86400);
  const hours = Math.floor((remainingTime - days * 86400) / 3600);

  return (
    <OverlayTrigger
      key={createdAt}
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={
        <Tooltip id={title}>
          {result === "Pending" && (
            <div>
              Time to vote: {remainingBlocks} blocks ({days}d {hours}h)
            </div>
          )}

          <div className="my-2 p-1 bg-light  text-secondary text-left">
            {text?.split(/\n/).map((line: string, i: number) => (
              <div key={i}>{htmr(line)}</div>
            ))}
          </div>

          {props.description}
        </Tooltip>
      }
    >
      <Link to={`/proposals/${props.id}`}>
        <div>{props.title}</div>
      </Link>
    </OverlayTrigger>
  );
};

export default ProposalOverlay;
