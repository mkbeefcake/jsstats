import React from "react";
import { Button } from "react-bootstrap";
import { Member, Vote } from "../../types";

const VoteDiv = (props: { votes?: Vote[]; member?: Member }) => {
  const { votes, member } = props;
  if (!votes || !member) return <td />;

  const v = votes.find((v) => v.handle === member.handle);
  if (!v || v.vote === "") return <td />;

  const styles: { [key: string]: string } = {
    Approve: "success",
    Reject: "danger",
    Abstain: "dark",
  };

  return (
    <td className="text-center p-0">
      <Button className="p-0" variant={styles[v.vote]}>
        {v.vote}
      </Button>
    </td>
  );
};

export default VoteDiv;
