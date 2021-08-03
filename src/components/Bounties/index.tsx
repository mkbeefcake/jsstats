import React from "react";
import { ListGroup } from "react-bootstrap";
import Loading from "../Loading";
import axios from "axios";
import bounties from "./bounties";

interface iProps {}

class Bounties extends React.Component<iProps> {
  constructor(iProps: {}) {
    super(iProps);

    this.state = { bounties };
  }

  async fetchBounties() {
    const { data } = await axios.get(`/static/bounties.json`);
    if (bounties) this.setState({ bounties: data });
  }

  render() {
    const { bounties } = this.state;
    if (!bounties.length) <Loading target={`bounties`} />;

    return (
      <div className="m-2 p-1 bg-light">
        <h4>Bounties</h4>
        <ListGroup>
          {bounties.map((b) => (
            <Bounty key={b} bounty={b} />
          ))}
          <ListGroup.Item>
            <a href="https://github.com/Joystream/community-repo/tree/master/workinggroup-reports/bounty_reports">
              Reports
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <a href="https://github.com/Joystream/community-repo/blob/master/bounties-overview/README.md">
              Closed Bounties
            </a>
          </ListGroup.Item>
        </ListGroup>
      </div>
    );
  }
}
export default Bounties;

const Bounty = (props: { bounty: string[] }) => {
  const [id, title, reward, thread, manager, status] = props.bounty;
  return (
    <ListGroup.Item className="d-flex flex-row">
      <div className="col-2">{id}</div>
      <div className="col-4">
        <a href={thread}>{title}</a>
      </div>
      <div className="col-2">{reward}</div>
      <div className="col-2">{manager}</div>
      <div className="col-2">{status}</div>
    </ListGroup.Item>
  );
};
