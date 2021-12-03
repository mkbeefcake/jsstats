import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Validator from "./Validator";
import Waiting from "./Waiting";
import { sortValidators } from "./util";

const ValidatorList = (props: IState) => {
  const [sortBy, setSortBy] = useState("totalStake");
  const [showWaiting, setShowWaiting] = useState(false);
  const toggleWaiting = () => setShowWaiting((prev) => !prev);

  const {
    stars,
    stakes,
    validators,
    status,
    councils,
    members,
    posts,
    proposals,
    rewardPoints,
    lastReward,
    startTime,
    waiting,
  } = props;
  const starred = validators.filter((v) => stars[v]);
  const unstarred = validators.filter((v) => !stars[v]);

  if (!props.showList)
    return (
      <Button variant="outline-warning" className="mt-1">
        <Link to={`/validators`}>Show Validators</Link>
      </Button>
    );
  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-wrap">
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
            member={members.find((m) => m.rootKey === v)}
            posts={posts}
            proposals={proposals}
            validators={validators}
            stakes={stakes}
            rewardPoints={rewardPoints}
          />
        ))}
      </div>

      <div className="d-flex flex-wrap">
        {sortValidators(sortBy, unstarred, stakes, rewardPoints).map((v) => (
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
            member={members.find((m) => m.rootKey === v)}
            posts={posts}
            proposals={proposals}
            validators={validators}
            stakes={stakes}
            rewardPoints={rewardPoints}
          />
        ))}
      </div>
      <Waiting
        toggleWaiting={toggleWaiting}
        show={showWaiting}
        waiting={waiting}
        posts={posts}
        proposals={proposals}
        members={members}
      />
    </div>
  );
};

export default ValidatorList;
