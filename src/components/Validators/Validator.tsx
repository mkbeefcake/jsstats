import React, { Component } from "react";
import { Activity, Star } from "react-feather";
import Nominators from "./Nominators";
import MemberBox from "../Members/MemberBox";
import { ProposalDetail, Seat, Stakes } from "../../types";
import { domain } from "../../config";

interface IProps {
  toggleStar: (account: string) => void;
  sortBy: (sortBy: string) => void;
  validator: string;
  councils: Seat[][];
  proposals: ProposalDetail[];
  validators: string[];
  startTime: number;
  starred: string | undefined;
  stakes?: { [key: string]: Stakes };
  reward?: number;
}

interface IState {
  expandNominators: boolean;
  hidden: boolean;
}

const fNum = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 0 });

class Validator extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { expandNominators: false, hidden: false };
    this.hide = this.hide.bind(this);
    this.toggleExpandNominators = this.toggleExpandNominators.bind(this);
  }

  hide() {
    this.setState({ hidden: true });
  }
  toggleExpandNominators() {
    this.setState({ expandNominators: !this.state.expandNominators });
  }

  render() {
    const {
      sortBy = () => {},
      toggleStar,
      member,
      validator,
      councils,
      council,
      posts,
      proposals,
      startTime,
      starred,
      stakes,
      reward = 0,
    } = this.props;
    const { expandNominators, hidden } = this.state;
    if (hidden) return <div />;

    const stake = stakes ? stakes[validator] : undefined;
    let totalStake = 0;
    let ownStake = 0;
    let commission = "";
    let ownReward = 0;
    let nomReward = 0;

    if (stake) {
      commission = `${stake.commission}%`;
      const comm = stake.commission / 100;
      // A commission of 5% means that for every 100tJOY earned,
      // validator takes 5 before splitting the remaining 95 based on stake
      totalStake = stake.total;
      ownStake = stake.own;
      const nom = 1 - ownStake / totalStake;
      nomReward = reward * (1 - comm) * nom;
      ownReward = reward - nomReward;
    }

    return (
      <div id={validator} className="p-2 col-12 col-md-6" style={{ fontSize: 11 }}>
        <MemberBox
          account={validator}
          placement={"right"}
          councils={councils}
          council={council}
          member={member}
          posts={posts}
          proposals={proposals}
          startTime={startTime}
          validators={this.props.validators}
        />

        <div className="mt-2 d-flex flex-row justify-content-around">
          <div onClick={() => sortBy("commission")} title="commission">
            {commission}
          </div>
          <div
            className="col-2 text-black text-right"
            onClick={() => sortBy("totalStake")}
            title="total stake"
          >
            {totalStake > 0 && fNum(totalStake)}
          </div>
          <div
            className="col-2 text-right"
            onClick={() => sortBy("ownStake")}
            title="own stake"
          >
            {ownStake > 0 && fNum(ownStake)}
          </div>
          {ownReward ? (
            <div className="col-1 text-warning" title="reward">
              +{Math.round(ownReward)}
            </div>
          ) : (
            <div />
          )}
          <div>
            <Star
              width={15}
              color={"white"}
              fill={starred ? "white" : "#4038FF"}
              onClick={() => toggleStar(validator)}
            />
          </div>
          <div>
            <a
              href={`${domain}/#/staking/query/${validator}`}
              title="Show Stats (External)"
            >
              <Activity width={15} />
            </a>
          </div>
        </div>

        <Nominators
          fNum={fNum}
          reward={nomReward}
          toggleExpand={this.toggleExpandNominators}
          sortBy={sortBy}
          expand={expandNominators}
          nominators={stake ? stake.others : undefined}
        />
      </div>
    );
  }
}

export default Validator;
