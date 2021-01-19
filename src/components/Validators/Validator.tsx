import React, { Component } from "react";
import { Activity, Minus, Star } from "react-feather";
import Nominators from "./Nominators";
import MemberBox from "../Members/MemberBox";
import {
  Handles,
  Member,
  Post,
  ProposalDetail,
  Seat,
  Stakes,
  RewardPoints,
} from "../../types";
import { domain } from "../../config";

interface IProps {
  toggleStar: (account: string) => void;
  sortBy: (sortBy: string) => void;
  validator: string;
  councils: Seat[][];
  handles: Handles;
  members: Member[];
  posts: Post[];
  proposals: ProposalDetail[];
  validators: string[];
  startTime: number;
  starred: string | undefined;
  stakes?: { [key: string]: Stakes };
  rewardPoints?: RewardPoints;
  reward?: number;
}

interface IState {
  expandNominators: boolean;
  hidden: boolean;
}

const fNum = (n: number) =>
  n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
      sortBy,
      toggleStar,
      handles,
      members,
      validator,
      councils,
      posts,
      proposals,
      startTime,
      starred,
      stakes,
      rewardPoints,
      reward = 0,
    } = this.props;
    const { expandNominators, hidden } = this.state;
    if (hidden) return <div />;

    const points = rewardPoints ? rewardPoints.individual[validator] : "";
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
      <div className="d-flex flex-row justify-content-around">
        <div className="col-2 col-md-1">
          <Minus width={15} color={"black"} onClick={this.hide} />
          <Star
            width={15}
            color={"black"}
            fill={starred ? "black" : "teal"}
            onClick={() => toggleStar(validator)}
          />
          <a
            href={`${domain}/#/staking/query/${validator}`}
            title="Show Stats (External)"
          >
            <Activity width={15} />
          </a>
        </div>
        <div
          className="col-1 text-right"
          onClick={() => sortBy("points")}
          title="era points"
        >
          {points}
        </div>
        <div className="col-2 text-right">
          <MemberBox
            id={0}
            account={validator}
            placement={"right"}
            councils={councils}
            handle={handles[validator]}
            members={members}
            posts={posts}
            proposals={proposals}
            startTime={startTime}
            validators={this.props.validators}
          />
        </div>

        <div
          className="col-1 text-right"
          onClick={() => sortBy("commission")}
          title="commission"
        >
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
        <div className="d-none d-md-block col-3 mb-1 text-left">
          <Nominators
            fNum={fNum}
            reward={nomReward}
            toggleExpand={this.toggleExpandNominators}
            sortBy={sortBy}
            expand={expandNominators}
            nominators={stake ? stake.others : undefined}
            handles={handles}
          />
        </div>
      </div>
    );
  }
}

export default Validator;
