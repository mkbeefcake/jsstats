import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import MemberBox from "../Members/MemberBox";

const WaitingButton = (props: {}) => {
  const { waiting, toggleWaiting } = props;
  return (
    <Button
      variant="secondary"
      className="mb-5"
      onClick={() => toggleWaiting()}
    >
      Toggle {waiting} waiting nodes
    </Button>
  );
};

const Waiting = (props: {}) => {
  const {
    toggleWaiting,
    show,
    waiting,
    councils,
    handles,
    members,
    posts,
    proposals,
    startTime,
    validators,
  } = props;

  if (!waiting.length) return <div />;
  if (!show)
    return (
      <WaitingButton toggleWaiting={toggleWaiting} waiting={waiting.length} />
    );

  return (
    <>
      <WaitingButton toggleWaiting={toggleWaiting} waiting={waiting.length} />
      <ListGroup className="waiting-validators">
        {waiting.map((v) => (
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
        ))}
      </ListGroup>
    </>
  );
};
export default Waiting;
