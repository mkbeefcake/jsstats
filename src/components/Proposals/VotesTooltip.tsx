import React from "react";
import { Table } from "react-bootstrap";
import { Vote } from "../../types";

const VotesTooltip = (props: { votes?: Vote[] }) => {
  if (!props.votes) return <div>Fetching votes..</div>;

  const votes = props.votes.filter((v) => (v.vote === `` ? false : true));
  if (!votes.length) return <div>No votes</div>;

  return (
    <Table className="text-left text-light">
      <tbody>
        {votes.map((v) => (
          <tr key={v.handle}>
            <td>{v.handle}:</td>
            <td>{v.vote}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default VotesTooltip;
