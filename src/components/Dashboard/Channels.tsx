import React from "react";
import SubBlock from "./ui/SubBlock";
import Line from "./ui/Line";

const Channels = (props: {}) => {

  return (
    <SubBlock title="Channels">
      <Line content={"created"} value={5} />
      <Line content={"total"} value={10000} />
    </SubBlock>
  );
};

export default Channels;
