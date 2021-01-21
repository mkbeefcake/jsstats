import React, { Component } from "react";
import MinMax from "./MinMax";
import Validator from "./Validator";
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

interface IProps {
  era: number;
  councils: Seat[][];
  handles: Handles;
  members: Member[];
  posts: Post[];
  proposals: ProposalDetail[];
  now: number;
  block: number;
  validators: string[];
  stashes: string[];
  nominators: string[];
  stars: { [key: string]: boolean };
  save: (target: string, data: any) => void;
  stakes?: { [key: string]: Stakes };
  rewardPoints?: RewardPoints;
  lastReward: number;

  issued: number;
  price: number;
}

interface IState {
  sortBy: string;
}

class Validators extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { sortBy: "totalStake" };
    this.toggleStar = this.toggleStar.bind(this);
    this.setSortBy = this.setSortBy.bind(this);
  }

  toggleStar(account: string) {
    let { stars } = this.props;
    stars[account] = !stars[account];
    this.props.save("stars", stars);
  }

  setSortBy(sortBy: string) {
    this.setState({ sortBy });
  }
  sortBy(field: string, validators: string[]) {
    const { stakes, rewardPoints } = this.props;
    try {
      if (field === "points")
        return validators.sort((a, b) =>
          rewardPoints
            ? rewardPoints.individual[b] - rewardPoints.individual[a]
            : 0
        );

      if (field === "commission")
        return validators.sort((a, b) =>
          stakes ? stakes[a].commission - stakes[b].commission : 0
        );

      if (field === "ownStake")
        return validators.sort((a, b) =>
          stakes ? stakes[b].own - stakes[a].own : 0
        );

      if (field === "totalStake")
        return validators.sort((a, b) =>
          stakes ? stakes[b].total - stakes[a].total : 0
        );

      if (field === "othersStake") {
        const sumOf = (stakes: { value: number }[]) => {
          let sum = 0;
          stakes.forEach((s) => (sum += s.value));
          return sum;
        };

        return validators.sort((a, b) =>
          stakes ? sumOf(stakes[b].others) - sumOf(stakes[a].others) : 0
        );
      }
    } catch (e) {
      console.debug(`sorting failed`, e);
    }

    return validators;
  }

  render() {
    const {
      block,
      era,
      now,
      councils,
      handles,
      members,
      posts,
      proposals,
      validators,
      nominators,
      stashes,
      stars,
      lastReward,
      rewardPoints,
      stakes,
      issued,
      price,
    } = this.props;
    const { sortBy } = this.state;
    const startTime = now - block * 6000;

    const starred = stashes.filter((v) => stars[v]);
    const unstarred = validators.filter((v) => !stars[v]);
    const waiting = stashes.filter((s) => !stars[s] && !validators.includes(s));

    return (
      <div className="box w-100 m-0 px-5">
        <div className="float-left">
          last block: {block}, era {era}
        </div>
        <MinMax
          stakes={stakes}
          issued={issued}
          price={price}
          validators={validators.length}
          nominators={nominators.length}
          waiting={waiting.length}
          reward={lastReward}
        />

        <h3>Validators</h3>

        <div className="d-flex flex-column">
          {this.sortBy(sortBy, starred).map((v) => (
            <Validator
              key={v}
              sortBy={this.setSortBy}
              starred={stars[v] ? `teal` : undefined}
              toggleStar={this.toggleStar}
              startTime={startTime}
              validator={v}
              reward={lastReward / validators.length}
              councils={councils}
              handles={handles}
              members={members}
              posts={posts}
              proposals={proposals}
              validators={validators}
              stakes={stakes}
              rewardPoints={rewardPoints}
            />
          ))}
          {this.sortBy(sortBy, unstarred).map((v) => (
            <Validator
              key={v}
              sortBy={this.setSortBy}
              starred={stars[v] ? `teal` : undefined}
              toggleStar={this.toggleStar}
              startTime={startTime}
              validator={v}
              reward={lastReward / validators.length}
              councils={councils}
              handles={handles}
              members={members}
              posts={posts}
              proposals={proposals}
              validators={validators}
              stakes={stakes}
              rewardPoints={rewardPoints}
            />
          ))}
          {waiting.length ? (
            <div>
              <hr />
              Waiting:
              {waiting.map((v) => (
                <MemberBox
                  key={v}
                  id={0}
                  account={v}
                  placement={"top"}
                  councils={councils}
                  handle={handles[v]}
                  members={members}
                  posts={posts}
                  proposals={proposals}
                  startTime={startTime}
                  validators={validators}
                />
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default Validators;
