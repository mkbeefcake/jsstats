import React from "react";
import ValidatorRewards from "./ValidatorRewards";
import Back from "../Back";
import Loading from "../Loading";

interface IProps {
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

    this.state = {
      start,
      end,
      role: "",
      salary: 0,
      payout: 0,
    };
    this.setRole = this.setRole.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ payout: this.props.lastReward });
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
    const { tokenomics } = this.props;
    if (!tokenomics) return <Loading />;
    const { role, start, salary, end, payout } = this.state;

    const { price } = tokenomics;
    const rate = Math.floor(+price * 100000000) / 100;
    const blocks = end - start;

    return (
      <div className="p-3 text-light">
        <h2>Mint</h2>
        <div className="d-flex flex-row form-group">
          <label className="col-2">Token value</label>
          <input
            className="form-control col-4"
            disabled={true}
            name="rate"
            type="text"
            value={`${rate} $ / 1 M JOY`}
          />
        </div>
        <div className="d-flex flex-row form-group">
          <label className="col-2">Start block</label>
          <input
            className="form-control col-4"
            onChange={this.handleChange}
            name="start"
            type="number"
            value={start}
          />
        </div>
        <div className="d-flex flex-row form-group">
          <label className="col-2">End block</label>
          <input
            className="form-control col-4"
            onChange={this.handleChange}
            name="end"
            type="number"
            value={end}
          />
        </div>

        <div className="d-flex flex-row form-group">
          <label className="col-2">Blocks</label>
          <input
            className="form-control col-4"
            disabled={true}
            name="blocks"
            type="number"
            value={blocks}
          />
        </div>
        <div className="d-flex flex-row form-group">
          <label className="col-2">Role</label>
          <select
            name="role"
            className="form-control col-4"
            onChange={this.setRole}
          >
            {Object.keys(salaries).map((r: string) => (
              <option selected={role === r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="d-flex flex-row form-group">
          <label className="col-2">
            Reward (JOY / {payoutInterval} blocks)
          </label>
          <input
            className="form-control col-4"
            name="baseReward"
            type="number"
            onChange={this.handleChange}
            value={salary}
          />
        </div>
        <div className="d-flex flex-row form-group">
          <label className="col-2">
            Reward (USD / {payoutInterval} blocks)
          </label>
          <input
            className="form-control col-4"
            disabled={true}
            name="baseRewardUSD"
            type="number"
            value={price * salary}
          />
        </div>
        <div className="d-flex flex-row form-group">
          <label className="col-2">Reward (JOY) / {blocks} blocks</label>
          <input
            className="form-control col-4"
            disabled={true}
            name="reward"
            type="number"
            value={(blocks / payoutInterval) * salary}
          />
        </div>
        <div className="d-flex flex-row form-group">
          <label className="col-2">Reward (USD) / {blocks} blocks</label>
          <input
            className="form-control col-4"
            disabled={true}
            name="joy"
            type="number"
            value={(blocks / payoutInterval) * salary * price}
          />
        </div>

        <ValidatorRewards
          handleChange={this.handleChange}
          validators={this.props.validators.length}
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
