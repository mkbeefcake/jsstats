import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Bar = (props: {
  id: number;
  blocks: number;
  created: string;
  period: number;
  expires: string;
  left: string;
}) => {
  const { created, expires, id, left, percent } = props;
  if (percent < 0) return <div>updating ..</div>;
  const bg = percent < 25 ? `danger` : percent < 50 ? `warning` : `success`;

  return (
    <OverlayTrigger
      key={id}
      placement="bottom"
      overlay={
        <Tooltip id={String(id)}>
          <div className="text-left">
            <div className="mb-2">
              created:
              <div className="text-nowrap">{created}</div>
            </div>
            {left}
            <div>expires {expires}</div>
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
