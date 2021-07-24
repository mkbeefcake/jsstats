import React from "react";
import ValidatorRewards from "./ValidatorRewards";
import Back from "../Back";
import Loading from "../Loading";

interface IProps {
  mints: any[];
  tokenomics?: any;
  validators: string[];
  lastReward: number;
  history: any;
}
interface IState {
  start: number;
  end: number;
  role: string;
  salary: number;
  payout: number; // for validators
  [key: string]: number | string;
}

const round = 8;
const start = 57601 + round * 201600;
const end = 57601 + (round + 1) * 201600;

const payoutInterval = 3600;
const salaries: { [key: string]: number } = {
  storageLead: 21000,
  storageProvider: 10500,
  curatorLead: 20678,
  curator: 13500,
  consul: 8571,
};

class Mint extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { start, end, role: "", salary: 0 };
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
    if (!mint) return;
    const { capacity, total_minted } = mint;
    const fuel = (capacity / 1000000).toFixed(1);
    const minted = (total_minted / 1000000).toFixed(1);
    return `${fuel} M / ${minted} M tJOY`;
  }

  render() {
    const { tokenomics, validators, payout, mints } = this.props;
    if (!tokenomics) return <Loading target="tokenomics" />;

    const { role, start, salary, end } = this.state;
    const { price } = tokenomics;
    const rate = Math.floor(+price * 100000000) / 100;
    const blocks = end - start;

    return (
      <div className="p-3 text-light">
        <h2>Mint</h2>

        <div>
          <div className="d-flex d-row p-1 m-1">
            <div className="mint-label">Storage</div>
            <div> {this.formatMint(mints[2])}</div>
          </div>
          <div className="d-flex d-row p-1 m-1">
            <div className="mint-label">Curation</div>
            <div> {this.formatMint(mints[3])}</div>
          </div>
          <div className="d-flex d-row p-1 m-1">
            <div className="mint-label">Operations</div>
            <div> {this.formatMint(mints[4])}</div>
          </div>
        </div>

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
          <select name="role" className="form-control" onChange={this.setRole}>
            {Object.keys(salaries).map((r: string) => (
              <option selected={role === r}>{r}</option>
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
