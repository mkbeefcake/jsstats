import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import htmr from "htmr";

const ProposalOverlay = (props: any) => {
  const { block, createdAt, parameters } = props;

  const remainingBlocks = +createdAt + +parameters.votingPeriod - block;
  const remainingTime = remainingBlocks * 6;
  const days = Math.floor(remainingTime / 86400);
  const hours = Math.floor((remainingTime - days * 86400) / 3600);

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={
        <Tooltip id={props.title}>
          <div>
            Time to vote: {remainingBlocks} blocks ({days}d {hours}h)
          </div>
          <div className="my-2 text-left">
            {htmr(props.message.replace(/\n/, "<br/>"))}
          </div>
          {props.description}
        </Tooltip>
      }
    >
      <div>
        <a href={`https://pioneer.joystreamstats.live/#/proposals/${props.id}`}>
          {props.title}
        </a>
      </div>
    </OverlayTrigger>
  );
};

export default ProposalOverlay;
