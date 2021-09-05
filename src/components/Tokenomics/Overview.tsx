import React from "react";
import { Table } from "react-bootstrap";
import { Tokenomics } from "../../types";

const Overview = (props: { tokenomics: Tokenomics }) => {
  const { price, totalIssuance, validators } = props;
  return (
    <Table>
      <tbody>
        <tr>
          <td>Total Issuance</td>
          <td>{totalIssuance} JOY</td>
        </tr>
        <tr>
          <td>Validator Stake</td>
          <td>{validators.total_stake} JOY</td>
        </tr>
        <tr>
          <td>Price</td>
          <td>{(+price * 1000000).toFixed(2)} $ / 1 M JOY</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default Overview;
