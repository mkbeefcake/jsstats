import React from "react";
import ValidatorRewards from "./ValidatorRewards";
import Back from "../Back";
import Loading from "../Loading";

// TODO OPTIMIZE fetch live
import {
  getStart,
  getEnd,
  payoutInterval,
  mintTags,
  salaries,
} from "./config.ts";

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

  formatMint(mint: { capacity: number; total_minted: number }) {
    if (!mint) return `loading ..`;
    const { capacity, total_minted } = mint;
    const current = (capacity / 1000000).toFixed(1);
    const total = (total_minted / 1000000).toFixed(1);
    return `${current} M of ${total} M tJOY`;
  }

  render() {
    const { status, tokenomics, validators, payout, mints } = this.props;
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
        <h2 className="mb-3">Mints</h2>

        <div>
          {[2, 3, 4].map((m) => (
            <div key={m} className="d-flex d-row p-1 m-1">
              <div className="mint-label col-2">{mintTags[m]}</div>
              <div>{this.formatMint(mints[m])}</div>
            </div>
          ))}
        </div>

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
        <div className="position-fixed" style={{ right: "0px", top: "0px" }}>
          <Back history={this.props.history} />
        </div>
      </div>
    );
  }
}

export default Mint;
