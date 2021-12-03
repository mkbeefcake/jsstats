import React from "react";
import ValidatorRewards from "./ValidatorRewards";
import Loading from "../Loading";

import { getStart, getEnd, payoutInterval, salaries } from "./config.ts";

interface IProps {
  mints: any[];
  tokenomics?: any;
  validators: string[];
  lastReward: number;
  history: any;
}
interface IState {
  role: string;
  salary: number;
  payout: number; // for validators
  [key: string]: number | string;
}

class Mint extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { role: "", salary: 0 };
    this.setRole = this.setRole.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setRole({ target: { value: "consul" } });
  }

  setRole(e: any) {
    const role = e.target.value;
    this.setState({ role, salary: salaries[role] });
  }
  handleChange(e: {
    preventDefault: () => void;
    target: { name: string; value: any };
  }) {
    e.preventDefault();
    this.setState({ [e.target.name]: parseInt(e.target.value) });
  }

  render() {
    const { status, tokenomics, validators, payout } = this.props;
    if (!tokenomics) return <Loading target="tokenomics" />;
    if (!status.council) return <Loading target="council round" />;

    const { round } = status.council;
    const start = getStart(round);
    const end = getEnd(round);

    const { role, salary } = this.state;
    const { price } = tokenomics;
    const rate = Math.floor(+price * 100000000) / 100;
    const blocks = end - start;

    return (
      <div className="p-3 text-light">
        <h3 className="my-3">Rewards</h3>
        <div className="form-group">
          <label>Token value</label>
          <input
            className="form-control"
            disabled={true}
            name="rate"
            type="text"
            value={`${rate} $ / 1 M JOY`}
          />
        </div>
        <div className="form-group">
          <label>Start block</label>
          <input
            className="form-control"
            onChange={this.handleChange}
            name="start"
            type="number"
            value={start}
          />
        </div>
        <div className="form-group">
          <label>End block</label>
          <input
            className="form-control"
            onChange={this.handleChange}
            name="end"
            type="number"
            value={end}
          />
        </div>

        <div className="form-group">
          <label>Blocks</label>
          <input
            className="form-control"
            disabled={true}
            name="blocks"
            type="number"
            value={blocks}
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            defaultValue={role}
            className="form-control"
            onChange={this.setRole}
          >
            {Object.keys(salaries).map((r: string) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Reward (JOY / {payoutInterval} blocks)</label>
          <input
            className="form-control"
            name="baseReward"
            type="number"
            onChange={this.handleChange}
            value={salary}
          />
        </div>
        <div className="form-group">
          <label>Reward (USD / {payoutInterval} blocks)</label>
          <input
            className="form-control"
            disabled={true}
            name="baseRewardUSD"
            type="number"
            value={price * salary}
          />
        </div>
        <div className="form-group">
          <label>Reward (JOY) / {blocks} blocks</label>
          <input
            className="form-control"
            disabled={true}
            name="reward"
            type="number"
            value={(blocks / payoutInterval) * salary}
          />
        </div>
        <div className="form-group">
          <label>Reward (USD) / {blocks} blocks</label>
          <input
            className="form-control"
            disabled={true}
            name="joy"
            type="number"
            value={(blocks / payoutInterval) * salary * price}
          />
        </div>

        <ValidatorRewards
          handleChange={this.handleChange}
          validators={validators.length}
          payout={payout}
          price={this.props.tokenomics ? this.props.tokenomics.price : 0}
        />
      </div>
    );
  }
}

export default Mint;
