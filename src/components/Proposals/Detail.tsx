import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TableFromObject } from "..";

const amount = (amount: number) => (amount / 1000000).toFixed(2);
const Detail = (props: { detail?: any; type: string }) => {
  const { detail, type } = props;
  if (!detail) return <p>{type}</p>;

  if (type === "Text") return <p>Text</p>;

  if (type === "Spending")
    return (
      <>
        <b>Spending</b>
        <p>{amount(detail.Spending[0])} M tJOY</p>
      </>
    );

  if (type === "SetWorkingGroupMintCapacity")
    return (
      <p>
        Fill {detail.SetWorkingGroupMintCapacity[1]} working group mint
        <br />({amount(detail.SetWorkingGroupMintCapacity[0])} M tJOY)
      </p>
    );

  if (type === "SetWorkingGroupLeaderReward")
    return (
      <p>
        Set {detail.SetWorkingGroupLeaderReward[2]} working group reward (
        {amount(detail.SetWorkingGroupLeaderReward[1])} M tJOY,
        {detail.SetWorkingGroupLeaderReward[0]})
      </p>
    );

  if (type === "SetContentWorkingGroupMintCapacity")
    return (
      <p>
        SetContentWorkingGroupMintCapacity (
        {amount(detail.SetContentWorkingGroupMintCapacity)} M tJOY)
      </p>
    );

  if (type === "BeginReviewWorkingGroupLeaderApplication")
    return (
      <p>
        Hire {detail[type][1]} working group leader ({detail[type][0]})
      </p>
    );

  if (type === "SetValidatorCount")
    return <p>SetValidatorCount ({detail.SetValidatorCount})</p>;

  return (
    <OverlayTrigger
      placement={"right"}
      overlay={
        <Tooltip id={`${type}`} className="tooltip">
          <TableFromObject data={detail[type]} />
        </Tooltip>
      }
    >
      <div>{type}</div>
    </OverlayTrigger>
  );
};

export default Detail;
