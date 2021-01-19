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

    const handle = handles[validator] || validator;
    const points = rewardPoints ? rewardPoints.individual[validator] : "";
    const myStakes = stakes ? stakes[validator] : undefined;
    let totalStake = 0;
    let ownStake = 0;
    let commission = "";
    let ownReward = 0;
    let othersReward = 0;

    if (myStakes) {
      totalStake = myStakes.total;
      ownStake = myStakes.own;
      commission = `${myStakes.commission}%`;

      const own = ownStake / totalStake;
      const others = 1 - own;
      const commissionShare = myStakes.commission / 100;
      othersReward = reward * others * (1 - commissionShare);
      ownReward = reward * (own + others * commissionShare);
    }

    return (
      <div className="mx-3 d-flex flex-row">
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
        <div className="col-1 text-right" onClick={() => sortBy("points")}>
          {points}
        </div>
        <div className="col-4 text-right">
          <MemberBox
            id={0}
            account={validator}
            placement={"right"}
            councils={councils}
            handle={handle}
            members={members}
            posts={posts}
            proposals={proposals}
            startTime={startTime}
            validators={this.props.validators}
          />
        </div>

        <div className="col-1 text-right" onClick={() => sortBy("commission")}>
          {commission}
        </div>
        <div className="col-1 text-right" onClick={() => sortBy("totalStake")}>
          {totalStake > 0 && totalStake}
        </div>
        <div className="col-1 text-right" onClick={() => sortBy("ownStake")}>
          {ownStake > 0 && ownStake}
        </div>
        {ownReward ? (
          <div className="text-warning">+{Math.round(ownReward)}</div>
        ) : (
          <div />
        )}
        <div className="col-3 mb-1 text-left">
          <Nominators
            reward={othersReward}
            toggleExpand={this.toggleExpandNominators}
            sortBy={sortBy}
            expand={expandNominators}
            nominators={myStakes ? myStakes.others : undefined}
            handles={handles}
          />
        </div>
        <div onClick={() => sortBy("profit")}></div>
      </div>
    );
  }
}

export default Validator;
