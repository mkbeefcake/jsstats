import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, ListGroup } from "react-bootstrap";
import Stats from "./MinMax";
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
  Tokenomics,
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
  toggleStar: (account: string) => void;
  stakes?: { [key: string]: Stakes };
  rewardPoints?: RewardPoints;
  lastReward: number;
  tokenomics?: Tokenomics;
  hideBackButton?: boolean;
}

interface IState {
  sortBy: string;
  showValidators: boolean;
  showWaiting: boolean;
}

class Validators extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      sortBy: "totalStake",
      showWaiting: false,
      showValidators: false,
    };
    this.setSortBy = this.setSortBy.bind(this);
  }

  toggleValidators() {
    this.setState({ showValidators: !this.state.showValidators });
  }
  toggleWaiting() {
    this.setState({ showWaiting: !this.state.showWaiting });
  }
  setSortBy(sortBy: string) {
    this.setState({ sortBy });
  }
  sortBy(field: string, validators: string[]) {
    const { stakes, rewardPoints } = this.props;
    try {
      if (field === "points" || !stakes)
        return validators.sort((a, b) =>
          rewardPoints
            ? rewardPoints.individual[b] - rewardPoints.individual[a]
            : 0
        );

      if (field === "commission")
        return validators.sort((a, b) =>
          stakes[a] && stakes[b]
            ? stakes[a].commission - stakes[b].commission
            : 0
        );

      if (field === "ownStake")
        return validators.sort((a, b) =>
          stakes[a] && stakes[b] ? stakes[b].own - stakes[a].own : 0
        );

      if (field === "totalStake")
        return validators.sort((a, b) =>
          stakes[a] && stakes[b] ? stakes[b].total - stakes[a].total : 0
        );

      if (field === "othersStake") {
        const sumOf = (stakes: { value: number }[]) => {
          let sum = 0;
          stakes.forEach((s) => (sum += s.value));
          return sum;
        };

        return validators.sort((a, b) =>
          stakes[a] && stakes[b]
            ? sumOf(stakes[b].others) - sumOf(stakes[a].others)
            : 0
        );
      }
    } catch (e) {
      console.debug(`sorting failed`, e);
    }

    return validators;
  }

  render() {
    const {
      hideBackButton,
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
      tokenomics,
    } = this.props;
    const issued = tokenomics ? Number(tokenomics.totalIssuance) : 0;
    const price = tokenomics ? Number(tokenomics.price) : 0;

    const { sortBy, showWaiting, showValidators } = this.state;
    const startTime = now - block * 6000;

    const starred = stashes.filter((v) => stars[v]);
    const unstarred = validators.filter((v) => !stars[v]);
    const waiting = stashes.filter((s) => !stars[s] && !validators.includes(s));
    if (!unstarred.length) return <div />;
    return (
      <div className="box w-100 !mx-5">
        {hideBackButton ? (
          ""
        ) : (
          <Link className="back" to={"/"}>
            <Button variant="secondary">Back</Button>
          </Link>
        )}
        <h3 onClick={() => this.toggleValidators()}>Validator Stats</h3>

        <Stats
          block={block}
          era={era}
          stakes={stakes}
          issued={issued}
          price={price}
          validators={validators}
          nominators={nominators.length}
          waiting={waiting.length}
          reward={lastReward}
        />

        <div className="d-flex flex-column">
          {this.sortBy(sortBy, starred).map((v) => (
            <Validator
              key={v}
              sortBy={this.setSortBy}
              starred={stars[v] ? `teal` : undefined}
              toggleStar={this.props.toggleStar}
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

          <Button variant="secondary" onClick={() => this.toggleValidators()}>
            Toggle {unstarred.length} validators
          </Button>

          {showValidators &&
            this.sortBy(sortBy, unstarred).map((v) => (
              <Validator
                key={v}
                sortBy={this.setSortBy}
                starred={stars[v] ? `teal` : undefined}
                toggleStar={this.props.toggleStar}
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

          <Button
            variant="secondary"
            className="mb-5"
            onClick={() => this.toggleWaiting()}
          >
            Toggle {waiting.length} waiting nodes
          </Button>

          {waiting.length && showWaiting ? (
            <ListGroup className="waiting-validators">
              <hr />
              <h4 onClick={() => this.toggleWaiting()}>Waiting</h4>
              {waiting.map((v) => (
                <ListGroup.Item key={v}>
                  <MemberBox
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
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default Validators;
