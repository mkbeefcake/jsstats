import React from "react";
import SubBlock from "./ui/SubBlock";
import Line from "./ui/Line";

const Memberships = (props: {}) => {

  return (
    <SubBlock title="Memberships">
      <Line content={"created"} value={99} />
      <Line content={"created"} value={100} />
      <Line content={"total"} value={8000} />
    </SubBlock>
  );
};

export default Memberships;
