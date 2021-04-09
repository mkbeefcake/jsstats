import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TableFromObject } from "..";

const amount = (amount: number) => (amount / 1000000).toFixed(2);
const Detail = (props: { detail?: any; type: string }) => {
  const { detail, type } = props;
  if (type === "text") return <p>Text</p>;
  if (!detail) return <p>{type}</p>;
  const data = detail[type];
  if (!data) return console.log(`empty proposal detail`, detail);

  if (type === "spending")
    return (
      <>
        <b>Spending</b>
        <p title={`to ${data[1]}`}>{amount(data[0])} M tJOY</p>
      </>
    );

  if (type === "setWorkingGroupMintCapacity")
    return (
      <p>
        Fill {data[1]} working group mint
        <br />({amount(data[0])} M tJOY)
      </p>
    );

  if (type === "setWorkingGroupLeaderReward")
    return (
      <p>
        Set {data[2]} working group reward ({amount(data[1])} M tJOY,
        {data[0]})
      </p>
    );

  if (type === "setContentWorkingGroupMintCapacity")
    return <p>SetContentWorkingGroupMintCapacity ({amount(data)} M tJOY)</p>;

  if (type === "beginReviewWorkingGroupLeaderApplication")
    return (
      <p>
        Hire {data[1]} working group leader ({data[0]})
      </p>
    );

  if (type === "setValidatorCount") return <p>SetValidatorCount ({data})</p>;

  if (type === "addWorkingGroupLeaderOpening")
    return <p>Hire {data.working_group} lead</p>;

  console.log(detail);
  return (
    <OverlayTrigger
      placement={"right"}
      overlay={
        <Tooltip id={`${type}`} className="tooltip">
          <TableFromObject data={data} />
        </Tooltip>
      }
    >
      <div>{type}</div>
    </OverlayTrigger>
  );
};

export default Detail;
