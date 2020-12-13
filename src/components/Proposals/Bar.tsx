import React from "react";
import { Button, OverlayTrigger, Tooltip, Table } from "react-bootstrap";

const Bar = (props: {
  id: number;
  blocks: number | null;
  duration: string;
  period: number;
}) => {
  const { blocks, duration, id, period } = props;
  const percent = blocks ? 100 * (blocks / period) : 0;
  if (!percent) return <div>updating ..</div>
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

export default Bar