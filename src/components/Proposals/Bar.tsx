import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Bar = (props: {
  id: number;
  blocks: number;
  duration: string;
  period: number;
}) => {
  const { blocks, created, duration, id, period } = props;
  const percent = 100 - 100 * (blocks / period);
  if (percent < 0) return <div>updating ..</div>;
  const bg = percent < 25 ? `danger` : percent < 50 ? `warning` : `success`;

  return (
    <OverlayTrigger
      key={id}
      placement="bottom"
      overlay={
        <Tooltip id={String(id)}>
          <div>created: {created}</div>
          <div>age: {duration}</div>
          <div>
            {Math.floor(percent)}% of {period} blocks left
          </div>
        </Tooltip>
      }
    >
      <div
        className={`bg-${bg} mr-2`}
        style={{ height: `5px`, width: `${percent}%` }}
      ></div>
    </OverlayTrigger>
  );
};

export default Bar;
