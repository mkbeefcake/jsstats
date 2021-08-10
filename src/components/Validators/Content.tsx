import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Stats from "./MinMax";
import Validator from "./Validator";
import Waiting from "./Waiting";
import { Spinner } from "..";
import { sortValidators } from "./util";

const Content = (props: IState) => {
  const [sortBy, setSortBy] = useState("totalStake");

  const [showWaiting, setShowWaiting] = useState(false);
  const [showValidators, setShowValidators] = useState(false);

  const toggleValidators = () => setShowValidators((prev) => !prev);

  const toggleWaiting = () => setShowWaiting((prev) => !prev);

  const {
    getMember = () => {},
    councils,
    members,
    posts,
    proposals,
    validators,
    nominators,
    stashes,
    stars,
    rewardPoints,
    status,
    stakes,
    tokenomics,
  } = props;

  if (!status?.block || !validators.length) return <Spinner />;

  const { lastReward, block, era, startTime } = status;

  const issued = tokenomics ? Number(tokenomics.totalIssuance) : 0;
  const price = tokenomics ? Number(tokenomics.price) : 0;

  const starred = stashes.filter((v) => stars[v]);
  const unstarred = validators.filter((v) => !stars[v]);
  const waiting = stashes.filter((s) => !stars[s] && !validators.includes(s));

  return (
    <>
      <Stats
        block={block}
        era={era}
        stakes={stakes}
        issued={issued}
        price={price}
        validators={validators}
        nominators={nominators.length}
        waiting={waiting.length}
        reward={status.lastReward}
      />
      <div className="d-flex flex-column mt-3">
        {sortValidators(sortBy, starred, stakes, rewardPoints).map((v) => (
          <Validator
            key={v}
            sortBy={setSortBy}
            starred={stars[v] ? `teal` : undefined}
            toggleStar={props.toggleStar}
            startTime={startTime}
            validator={v}
            reward={lastReward / validators.length}
            councils={councils}
            council={status.council}
            member={getMember(v)}
            posts={posts}
            proposals={proposals}
            validators={validators}
            stakes={stakes}
            rewardPoints={rewardPoints}
          />
        ))}

        <Button onClick={() => toggleValidators()}>
          Toggle {unstarred.length} validators
        </Button>

        {showValidators &&
          sortValidators(sortBy, unstarred, stakes, rewardPoints).map((v) => (
            <Validator
              key={v}
              sortBy={setSortBy}
              starred={stars[v] ? `teal` : undefined}
              toggleStar={props.toggleStar}
              startTime={startTime}
              validator={v}
              reward={lastReward / validators.length}
              councils={councils}
              council={status.council}
              member={getMember(v)}
              posts={posts}
              proposals={proposals}
              validators={validators}
              stakes={stakes}
              rewardPoints={rewardPoints}
            />
          ))}

        <Waiting
          toggleWaiting={toggleWaiting}
          show={showWaiting}
          waiting={waiting}
          posts={posts}
          proposals={proposals}
          members={members}
        />
      </div>
    </>
  );
};

export default Content;
