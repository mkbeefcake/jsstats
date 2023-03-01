import React from "react";
import SubBlock from "../ui/SubBlock";
import Line from "./ui/Line";
import { ElectedCouncil } from "@/queries";
import { useVideos } from "@/hooks";

const Videos = (props: { council: ElectedCouncil | undefined}) => {
  const { council } = props;
  const { created, total, loading, error } = useVideos({ council });

  return (
    <SubBlock title="Videos">
      { !loading && (
        <>
          <Line content={"Created"} value={created} />
          <Line content={"Total"} value={total} />
        </>
      )}
    </SubBlock>
  );
};

export default Videos;
