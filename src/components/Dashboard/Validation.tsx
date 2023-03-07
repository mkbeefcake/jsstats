import React, { useEffect, useState } from "react";
import SubBlock from "../ui/SubBlock";
import Line from "../ui/Line";
import { ElectedCouncil } from "@/queries";
import { useValidation } from "@/hooks";

const Validation = (props: { council: ElectedCouncil | undefined }) => {
  const { council } = props;
  const [validation, setValidation] = useState({count: 0, minted: 0, stakes: 0});

  // const { validator, stake, mint, loading, error } = useValidation({ council });
  // console.log("validation", validator, stake, mint, loading)

  useEffect(() => {
    const data = localStorage.getItem("validation");
    if (!data) return;

    setValidation(JSON.parse(data));
  }, [])

  return (
    <SubBlock title="Validation">
      {(
        <>
          <Line content={"Count"} value={validation.count} />
          <Line content={"Minted"} value={validation.minted} />
          <Line content={"Staked"} value={validation.stakes} />
        </>
      )}
    </SubBlock>
  );
};

export default Validation;
