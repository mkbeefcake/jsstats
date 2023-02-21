import React from "react";
import SubBlock from "./ui/SubBlock";
import Line from "./ui/Line";
import { ElectedCouncil } from "@/queries";
import { useChannels } from "@/hooks";

const Channels = (props: { council: ElectedCouncil | undefined }) => {
  const { council } = props;
  const { created, total, loading, error } = useChannels({ council });

  return (
    <SubBlock title="Channels">
      { !loading && (
        <>
          <Line content={"Created"} value={created} />
          <Line content={"Total"} value={total} />
        </>
      )}
    </SubBlock>
  );
};

export default Channels;
