import React from "react";
import SubBlock from "./ui/SubBlock";
import Line from "./ui/Line";
import { ElectedCouncil } from "@/types";
import { useMemberships } from "@/hooks";

const Memberships = (props: { council: ElectedCouncil | undefined }) => {
  const { council } = props;
  const { created, invited, total, loading, error } = useMemberships({ council });

  console.log(created, invited, total, loading)

  return (
    <SubBlock title="Memberships">
      { !loading && (
        <>
          <Line content={"Created"} value={created} />
          <Line content={"Invited"} value={invited} />
          <Line content={"Total"} value={total} />
        </>
      )}
    </SubBlock>
  );
};

export default Memberships;
