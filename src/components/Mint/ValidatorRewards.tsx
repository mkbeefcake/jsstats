import React from "react";
import { Table } from "react-bootstrap";

const ValidatorRewards = (props: {
  handleChange: (e: any) => void;
  validators: number;
  payout: number;
  price: number;
}) => {
  const { validators, payout, price } = props;
  return (
    <div>
      <h2 className="mt-5 text-center">Validator Rewards</h2>
      <label>Payment / h</label>
      <input
        className="form-control col-4"
        onChange={props.handleChange}
        name="payout"
        type="number"
        value={payout}
      />
      <h3 className="mt-3">Reward for increasing Validator counts</h3>
      <Table className="bg-light">
        <Thead />
        <tbody>
          {[validators, 45, 100, 200, 300, 500].map((count) => (
            <ValidatorRow
              key={`vcount-${count}`}
              price={price}
              payout={payout}
              count={count}
            />
          ))}
        </tbody>
      </Table>
      <h3 className="mt-2">Increased Payments for stable Validator rewards</h3>
      <Table className="bg-light">
        <Thead />
        <tbody>
          {[validators, 45, 100, 200, 300, 500].map((count) => (
            <ValidatorRow
              key={`vcount-${count}`}
              price={price}
              payout={(payout / validators) * count}
              count={count}
            />
          ))}
        </tbody>
      </Table>
      For details see{" "}
      <a href="https://github.com/Joystream/community-repo/blob/master/community-contributions/miscellaneous_reports/Increase%20Validator%20Set%20Research.md">
        Increase Validator Set Research
      </a>{" "}
      and{" "}
      <a href="https://testnet.joystream.org/#/forum/threads/125">
        Validator count discussion
      </a>
      .
    </div>
  );
};

const Thead = () => {
  return (
    <thead>
      <tr>
        <th></th>
        <th colSpan={6}>Costs</th>
        <th colSpan={8}>Reward per Validator</th>
      </tr>
      <tr>
        <th>Validator Count</th>
        <th>tJOY/h</th>
        <th>$/h</th>
        <th>$/d</th>
        <th>tJOY/w</th>
        <th>$/w</th>
        <th>$/m</th>
        <th>tJOY/h</th>
        <th>$/h</th>
        <th>tJOY/d</th>
        <th>$/d</th>
        <th>tJOY/w</th>
        <th>$/w</th>
        <th>tJOY/m</th>
        <th>$/m</th>
      </tr>
    </thead>
  );
};

const ValidatorRow = (props: {
  count: number;
  price: number;
  payout: number;
}) => {
  const { count, price, payout } = props;
  return (
    <tr>
      <td>{count}</td>

      <td>{payout.toFixed()}</td>
      <td>{(price * payout).toFixed(1)}</td>
      <td>{(24 * price * payout).toFixed(1)}</td>
      <td>{(24 * 7 * payout).toFixed()}</td>
      <td>{(24 * 7 * price * payout).toFixed()}</td>
      <td>{(24 * 7 * 4 * price * payout).toFixed()}</td>

      <td>{(payout / count).toFixed()}</td>
      <td>{((price * payout) / count).toFixed(2)}</td>
      <td>{((24 * payout) / count).toFixed()}</td>
      <td>{((price * 24 * payout) / count).toFixed(2)}</td>
      <td>{((24 * 7 * payout) / count).toFixed()}</td>
      <td>{((price * 24 * 7 * payout) / count).toFixed(2)}</td>
      <td>{((24 * 7 * 4 * payout) / count).toFixed()}</td>
      <td>{((price * 24 * 7 * 4 * payout) / count).toFixed(2)}</td>
    </tr>
  );
};

export default ValidatorRewards;
