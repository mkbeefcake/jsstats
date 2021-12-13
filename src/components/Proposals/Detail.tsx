import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TableFromObject } from "..";

const mJoy = (mJoy: number) => (mJoy / 1000000).toFixed(2);
const Detail = (props: { mJoy: number; detail?: any; type: string }) => {
  const { amount, detail, type } = props;
  if (type === "text") return <span>Text</span>;

  if (type === "spending") return <span>Spending ({mJoy(amount)} M tJOY)</span>;

  if (!detail) return <span>{type}</span>;
  const data = detail[type];
  if (!data) return console.log(`empty proposal detail`, detail);

  if (type === "spending")
    return (
      <span title={`to ${data[1]}`}>
        <b>Spending</b>: {mJoy(mJoy)} M tJOY
      </span>
    );

  if (type === "setWorkingGroupMintCapacity")
    return (
      <span>
        Fill {data[1]} working group mint: ({mJoy(data[0])} M tJOY)
      </span>
    );

  if (type === "setWorkingGroupLeaderReward")
    return (
      <span>
        Set {data[2]} working group reward ({mJoy(data[1])} M tJOY,
        {data[0]})
      </span>
    );

  if (type === "setContentWorkingGroupMintCapacity")
    return (
      <span>SetContentWorkingGroupMintCapacity ({mJoy(data)} M tJOY)</span>
    );

  if (type === "beginReviewWorkingGroupLeaderApplication")
    return (
      <span>
        Hire {data[1]} working group leader ({data[0]})
      </span>
    );

  if (type === "setValidatorCount")
    return <span>SetValidatorCount ({data})</span>;

  if (type === "addWorkingGroupLeaderOpening")
    return <span>Hire {data.working_group} lead</span>;

  if (type === "terminateWorkingGroupLeaderRole")
    return <span>Fire {data.working_group} lead</span>;

  console.debug(`unhandled detail:`, detail);

  return (
    <OverlayTrigger
      placement={"right"}
      overlay={
        <Tooltip id={`${type}`} className="tooltip">
          <TableFromObject data={data} />
        </Tooltip>
      }
    >
      <span>{type}</span>
    </OverlayTrigger>
  );
};

export default Detail;
