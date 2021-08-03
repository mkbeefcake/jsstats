import React from "react";
import InfoTooltip from "../Tooltip";

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
    <InfoTooltip
      placement="bottom"
      key={id}
      title={
        <div className="text-left">
          <div className="mb-2">
            created:
            <div className="text-nowrap">{created}</div>
          </div>
          {left}
          <div>expires {expires}</div>
        </div>
      }
    >
      <div
          className={`bg-${bg} mr-2 mt-2`}
          style={{ cursor: "pointer", height: `5px`, width: `${percent}%` }}
      />

    </InfoTooltip>
  );
};

export default Bar;
