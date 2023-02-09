import React from "react";
import SubBlock from "./ui/SubBlock";
import Line from "./ui/Line";

const Videos = (props: {}) => {

  return (
    <SubBlock title="Videos">
      <Line content={"created"} value={5} />
      <Line content={"total"} value={10000} />
    </SubBlock>
  );
};

export default Videos;
