import React from "react";
import { Badge, Button, Modal } from "react-bootstrap";
//import moment from "moment";

const Status = (props) => {
  const {
    show,
    onHide,
    status,
    members,
    posts,
    threads,
    categories,
    proposals,
  } = props;

  const have =
    proposals.length +
    members.length +
    posts.length +
    threads.length +
    categories.length;
  const need =
    status.proposals +
    status.members +
    status.posts +
    status.threads +
    status.categories;
  const missing = need - have;
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Header className="no-border" closeButton>
        <Modal.Title id="contained-modal-title-vcenter ">Cache</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div className="d-flex flex-column">
          <div className="d-flex flex-row">
            <div className="col-2 text-left">Queue</div>
            <div className="col-2 text-right">{missing}</div>
          </div>
          <Row
            min={proposals.filter((p) => p && p.votesByAccount).length}
            max={status.proposals}
            label="Proposals"
          />
          <Row min={members.length} max={status.members} label="Members" />
          <Row min={posts.length} max={status.posts} label="Posts" />
          <Row min={threads.length} max={status.threads} label="Threads" />
          <Row
            min={categories.length}
            max={status.categories}
            label="Categories"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Row = (props: { min: number; max: number; label: string }) => {
  const { min, max, label } = props;
  const status = min < max ? `${min} / ${max}` : "Complete";
  const variant = min < max ? "warning" : "success";
  return (
    <div className="d-flex flex-row">
      <div className="col-2 text-left">{label}</div>
      <div className="col-2 text-right">
        <Badge className="text-right" variant={variant}>
          {status}
        </Badge>
      </div>
    </div>
  );
};

export default Status;
