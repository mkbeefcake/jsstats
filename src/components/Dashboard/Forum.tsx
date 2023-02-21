import React from "react";
import SubBlock from "./ui/SubBlock";
import Line from "./ui/Line";
import { ElectedCouncil } from "@/queries";
import { usePostTokenData, useThreadData } from "@/hooks";

const Forum = (props: { council: ElectedCouncil | undefined}) => {
  const { council } = props;
  const thread = useThreadData({ council });
  const post = usePostTokenData({ council });

  return (
    <SubBlock title="Forum">
      { !thread.loading && (
        <>
          <Line content={"Threads created"} value={thread.created} />
          <Line content={"Threads total"} value={thread.total} />
        </>
      )}
      { !post.loading && (
        <>
          <Line content={"Posts created"} value={post.created} />
          <Line content={"Posts total"} value={post.total} />
        </>
      )}
    </SubBlock>
  );
};

export default Forum;
