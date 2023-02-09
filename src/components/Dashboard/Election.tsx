import React from "react";
import SubBlock from "./ui/SubBlock";
import Line from "./ui/Line";

const Election = (props: {}) => {

  return (
    <SubBlock title="Election">
      <Line content={"candidates"} value={5} />
      <Line content={"votes"} value={232} />
      <Line content={"staked"} value={99093123} />
    </SubBlock>
  );
};

export default Election;
