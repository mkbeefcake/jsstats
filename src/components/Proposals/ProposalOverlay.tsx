import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import htmr from "htmr";

const ProposalOverlay = (props: any) => {
  return (
    <OverlayTrigger
      placement="right"
      overlay={
        <Tooltip id={props.title}>
          <div className="text-left">
            {htmr(props.message.replace(/\n/, "<br/>"))}
          </div>
        </Tooltip>
      }
    >
      <div>
        {props.title}{" "}
        <a href={`https://pioneer.joystreamstats.live/#/proposals/${props.id}`}>
          &rsaquo;
        </a>
      </div>
    </OverlayTrigger>
  );
};

export default ProposalOverlay;
