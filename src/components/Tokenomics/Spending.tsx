import React from "react";
import { Table } from "react-bootstrap";
import { RoleSpending } from "../../types";

const mJoy = (joy: number) => (joy / 1000000).toFixed(3);
const percent = (joy, total) => ((100 * joy) / total).toFixed(2);

const Spending = (props: { roles: RoleSpending[] }) => {
  const { groups, price } = props;
  if (!groups?.length) return <div />;

  const minted = groups.reduce((sum, { earning }) => earning + sum, 0);
  const staked = groups.reduce((sum, { stake }) => stake + sum, 0);
  return (
    <Table className="px-3 text-light">
      <thead>
        <tr>
          <th>Role</th>
          <th>Actors</th>
          <th>Earning [MJOY]</th>
          <th>Earning [USD]</th>
          <th>Earning [%]</th>
          <th>Stake [MJOY]</th>
          <th>Stake [USD]</th>
          <th>Stake [%]</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((role, key: number) => (
          <tr key={key}>
            <td>{role.name}</td>
            <td>{role.actors}</td>
            <td>{mJoy(role.earning)}</td>
            <td>{(role.earning * price).toFixed(2)}</td>
            <td>{percent(role.earning, minted)}</td>
            <td>{mJoy(role.stake)}</td>
            <td>{(role.stake * price).toFixed(2)}</td>
            <td>{percent(role.stake, staked)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Spending;
