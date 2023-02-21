import React from "react";
import SubBlock from "./ui/SubBlock";
import Line from "./ui/Line";
import { ElectedCouncil } from "@/queries";
import { useValidation } from "@/hooks";

const Validation = (props: { council: ElectedCouncil | undefined }) => {
  const { council } = props;
  const { validator, stake, mint, loading, error } = useValidation({ council });

  console.log("validation", validator, stake, mint, loading)

  return (
    <SubBlock title="Validation">
      { !loading && (
        <>
          <Line content={"Count"} value={validator} />
          <Line content={"Minted"} value={mint} />
          <Line content={"Staked"} value={stake} />
        </>
      )}
    </SubBlock>
  );
};

export default Validation;
