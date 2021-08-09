import React from "react";
import { Table } from "react-bootstrap";

const Terms = (props: { councils: Council[], stage: number[] }) => {
  const { councils, stage } = props;
  return (
    <Table className="w-100 text-light">
      <thead>
        <tr>
          <th>Round</th>
          <th>Announced</th>
          <th>Voted</th>
          <th>Revealed</th>
          <th>Term start</th>
          <th>Term end</th>
        </tr>
      </thead>
      <tbody>
        {councils
          .sort((a, b) => a.round - b.round)
          .map((council, i: number) => (
            <tr key={i + 1}>
              <td>{i + 1}</td>
              <td>{1 + i * stage[4]}</td>
              <td>
                {council.start} {stage[0] + i * stage[4]}
              </td>
              <td>
                {council.start + stage[1]} {stage[0] + stage[1] + i * stage[4]}
              </td>
              <td>
                {council.start + stage[1] + stage[2]}{" "}
                {stage[0] + stage[2] + stage[3] + i * stage[4]}
              </td>
              <td>{(1 + i) * stage[4]}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};
export default Terms;
