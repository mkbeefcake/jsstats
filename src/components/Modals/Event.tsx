import React from "react";
import { Button, Modal } from "react-bootstrap";

const Event = (props) => {
  const {
    event: { blockId, method, section, data },
    onHide,
  } = props;
  console.debug(`Event`, props);
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
      onHide={onHide}
    >
      <Modal.Header className="no-border" closeButton>
        <Modal.Title id="contained-modal-title-vcenter ">
          #{blockId}: {section}.{method}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {data.map((object, index) => (
          <ObjectValues key={index} object={object} />
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={() => onHide()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ObjectValues = (props) => {
  const { object } = props;
  if (!object) return <div/>
  if (typeof object !== "object") return <div>{object}</div>;
  return Object.keys(object).map((key) => (
    <div key={key} className="d-flex flex-row justify-content-between">
      <div>{key}</div>
      <ObjectValues object={object[key]} />
    </div>
  ));
};

export default Event;
