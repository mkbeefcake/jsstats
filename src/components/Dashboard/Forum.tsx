import React from "react";
import SubBlock from "./ui/SubBlock";
import Line from "./ui/Line";

const Forum = (props: {}) => {

  return (
    <SubBlock title="Forum">
      <Line content={"threads new"} value={13} />
      <Line content={"threads total"} value={432} />
      <Line content={"posts new"} value={99} />
      <Line content={"posts total"} value={712} />
    </SubBlock>
  );
};

export default Forum;
