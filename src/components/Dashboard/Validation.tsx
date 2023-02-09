import React from "react";
import SubBlock from "./ui/SubBlock";
import Line from "./ui/Line";

const Validation = (props: {}) => {

  return (
    <SubBlock title="Validation">
      <Line content={"count"} value={5} />
      <Line content={"minted"} value={100} />
      <Line content={"staked"} value={99093123} />
    </SubBlock>
  );
};

export default Validation;
