import { useState } from "react";
import {  Form, FormGroup } from "react-bootstrap";
import { Button, Modal } from "react-bootstrap";

const EditKpi = (props) => {
  const [kpi, handleChange] = useState(props.kpi);
  const [tab, setTab] = useState();
  const { save, cancel } = props;
  const {
    id,
    title,
    reward,
    fiatPool,
    distribution,
    process,
    active,
    purpose,
    scope,
    rewardDistribution,
    note,
  } = kpi;

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
      onHide={() => cancel()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit KPI {id}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        {tab === "purpose" ? (
          <Text handleChange={handleChange} value={purpose} name="purpose" />
        ) : tab === "scope" ? (
          <Text handleChange={handleChange} value={scope} name="scope" />
        ) : tab === "distribution" ? (
          <Text
            handleChange={handleChange}
            value={rewardDistribution}
            name="rewardDistribution"
          />
        ) : tab === "note" ? (
          <Text handleChange={handleChange} value={note} name="note" />
        ) : (
          <Form>
            <Input handleChange={handleChange} name="title" value={title} />
            <Input handleChange={handleChange} name="reward" value={reward} />
            <Input
              handleChange={handleChange}
              name="fiatPool"
              value={fiatPool}
            />
            <Input
              handleChange={handleChange}
              name="distribution"
              value={distribution}
            />
            <Input handleChange={handleChange} name="process" value={process} />
            <Input handleChange={handleChange} name="active" value={active} />
          </Form>
        )}
        <div id="tabs" className="d-flex flex-row">
          <Button
            variant={tab === "" ? "dark" : "outline-dark"}
            className="btn-sm mr-1"
            onClick={() => setTab("")}
          >
            Overview
          </Button>
          <Button
            variant={tab === "purpose" ? "dark" : "outline-dark"}
            className="btn-sm mr-1"
            onClick={() => setTab("purpose")}
          >
            Purpose
          </Button>
          <Button
            variant={tab === "scope" ? "dark" : "outline-dark"}
            className="btn-sm mr-1"
            onClick={() => setTab("scope")}
          >
            Purpose
          </Button>
          <Button
            variant={tab === "distribution" ? "dark" : "outline-dark"}
            className="btn-sm mr-1"
            onClick={() => setTab("distribution")}
          >
            Reward Distribution
          </Button>
          <Button
            variant={tab === "note" ? "dark" : "outline-dark"}
            className="btn-sm mr-1"
            onClick={() => setTab("note")}
          >
            Note
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row">
        <Button variant="outline" onClick={() => cancel()}>
          Close
        </Button>
        <Button disabled={true} variant="dark" onClick={() => save(kpi)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditKpi;

const Text = (props: { name; value }) => (
  <textarea
    className="form-control mb-4"
    name={props.name}
    value={props.value}
    placeholder={props.name}
    onChange={props.handleChange}
    rows="20"
  >
    {props.value}
  </textarea>
);

const Input = (props: { name; value }) => (
  <FormGroup>
    <label>{props.name[0].toUpperCase() + props.name.slice(1)}</label>
    <input
      className="form-control"
      name={props.name}
      value={props.value}
      placeholder={props.name}
      onChange={props.handleChange}
    />
  </FormGroup>
);
