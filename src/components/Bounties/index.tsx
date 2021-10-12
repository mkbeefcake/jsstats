import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";

import Loading from "../Loading";
import "./bounties.css";

interface IBounty {
  id: any;
  title: string;
  description: string;
  format: string;
  openedDate: any;
  status: string;
  reward: string | number;
  manager: string[];
  links: string[];
}

const bountiesUrl =
  "https://raw.githubusercontent.com/Joystream/community-repo/master/bounties/overview/bounties-status.json";

function Bounties() {
  const [bounties, setBounties] = useState<IBounty[]>([]);

  const fetchBounties = (url: string) => {
    axios
      .get<{ activeBounties: IBounty[] }>(url)
      .then(({ data }) => data && setBounties(data.activeBounties));
  };

  useEffect(() => {
    fetchBounties(bountiesUrl);
  }, []);

  if (!bounties) return <Loading target={`bounties`} />;

  return (
    <div className="Bounties bg-light p-3">
      <h1>Bounties</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Opened</th>
            <th>Reward</th>
            <th>Manager</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bounties && bounties.map((b: any) => <Bounty key={b.id} {...b} />)}
        </tbody>
      </Table>
      <a href="https://github.com/Joystream/community-repo/tree/master/workinggroup-reports/bounty_reports">
        Reports
      </a>
      <br />
      <a href="https://github.com/Joystream/community-repo/blob/master/bounties-overview/README.md">
        Closed Bounties
      </a>
    </div>
  );
}
export default Bounties;

const Bounty = ({
  id,
  title,
  description,
  format,
  openedDate,
  status,
  reward,
  manager,
  links,
}: IBounty) => {
  return (
    <>
      <tr>
        <td rowSpan={2} className="font-weight-bold">
          {id}
        </td>
        <td>{openedDate}</td>
        <td>${reward}</td>
        <td>{manager?.join(", ")}</td>
        <td>{status}</td>
      </tr>
      <tr>
        <td colSpan={6}>
          <h3>{title}</h3>
          {description}
          {links.map((l, i) => (
            <div key={i}>
              <a href={l}>{l}</a>
            </div>
          ))}
        </td>
      </tr>
    </>
  );
};
