import React from "react";
import SubBlock from "../ui/SubBlock";
import Line from "./ui/Line";
import { ElectedCouncil } from "@/queries";
import { useElection } from "@/hooks";
import { sumStakes } from "@/helpers";

const Election = (props: { council: ElectedCouncil | undefined}) => {
  const { council } = props;
  const { election, loading, error } = useElection({ council });

  return (
    <SubBlock title="Election">
      { !loading && (
        <>
          <Line content={"Candidates"} value={election? election.candidates.length : "-"} />
          <Line content={"Votes"} value={election? election.castVotes.length: "-"} />
          <Line content={"Staked"} value={election? sumStakes(election.candidates).toString().slice(0, length - 10): "-"} />
        </>
      )}
    </SubBlock>
  );
};

export default Election;
