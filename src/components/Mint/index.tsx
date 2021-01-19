import React from "react";
import ValidatorRewards from "./ValidatorRewards";
import Back from "../Back";
import Loading from "../Loading";

interface IProps {
  tokenomics?: any;
  validators: string[];
  lastReward: number;
}
interface IState {
  [key: string]: number;
}

const round = 8;
const start = 57601 + round * 201600;
const end = 57601 + (round + 1) * 201600;

class Mint extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { start, end, reward: 10, role: 0, payout: 0 };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ payout: this.props.lastReward });
  }

  handleChange(e: {
    preventDefault: () => void;
    target: { name: string; value: string };
  }) {
    e.preventDefault();
    const value = parseInt(e.target.value);
    this.setState({ [e.target.name]: value > 0 ? value : 0 });
  }

  render() {
    const { tokenomics } = this.props;
    if (!tokenomics) return <Loading />;
    const { payout } = this.state;

    const { price } = tokenomics;
    const rate = Math.floor(+price * 100000000) / 100;

    const rewards: { [key: string]: number } = { storageLead: 23146 };
    const blocks = this.state.end - this.state.start;
    const baseReward = rewards[Object.keys(rewards)[this.state.role]];
    const rewardTime = 3600;
    const reward = (blocks / rewardTime) * baseReward;

    return (
      <div className="p-3 text-light">
        <h2>Mint</h2>

        <div className="d-flex flex-row form-group">
          <label className="col-2">Rate</label>
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
            value={this.state.start}
          />
        </div>

        <div className="d-flex flex-row form-group">
          <label className="col-2">End block</label>
          <input
            className="form-control col-4"
            onChange={this.handleChange}
            name="end"
            type="number"
            value={this.state.end}
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
            onChange={this.handleChange}
          >
            {Object.keys(rewards).map((role, index: number) => (
              <option key={index}>{role}</option>
            ))}
          </select>
        </div>

        <div className="d-flex flex-row form-group">
          <label className="col-2">Reward (JOY / {rewardTime} blocks)</label>
          <input
            className="form-control col-4"
            disabled={true}
            name="baseReward"
            type="number"
            value={baseReward}
          />
        </div>

        <div className="d-flex flex-row form-group">
          <label className="col-2">Reward (USD / {rewardTime} blocks)</label>
          <input
            className="form-control col-4"
            disabled={true}
            name="baseRewardUSD"
            type="number"
            value={price * baseReward}
          />
        </div>

        <div className="d-flex flex-row form-group">
          <label className="col-2">Reward (JOY)</label>
          <input
            className="form-control col-4"
            disabled={true}
            name="reward"
            type="number"
            value={reward}
          />
        </div>

        <div className="d-flex flex-row form-group">
          <label className="col-2">Reward (USD)</label>
          <input
            className="form-control col-4"
            disabled={true}
            name="joy"
            type="number"
            value={price * reward}
          />
        </div>

        <ValidatorRewards
          handleChange={this.handleChange}
          validators={this.props.validators.length}
          payout={payout}
          price={this.props.tokenomics ? this.props.tokenomics.price : 0}
        />

        <Back />
      </div>
    );
  }
}

export default Mint;
