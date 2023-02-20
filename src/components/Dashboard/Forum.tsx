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
          <Line content={"threads new"} value={thread.created} />
          <Line content={"threads total"} value={thread.total} />
        </>
      )}
      { !post.loading && (
        <>
          <Line content={"posts new"} value={post.created} />
          <Line content={"posts total"} value={post.total} />
        </>
      )}
    </SubBlock>
  );
};

export default Forum;
