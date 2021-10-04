import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

import Loading from '../Loading';
import './bounties.css';

interface IBounty {
  id: any;
  title: string;
  description: string;
  format: string;
  openedDate: any;
  status: string;
  reward: string | number;
  manager: string[],
  links: string[];
}

function Bounties() {
  const [bounties, setBounties] = useState<IBounty[] | null>(null);

  const fetchBounties = async () => {
    const response = await axios.get<{ activeBounties: IBounty[] }>(
      `https://raw.githubusercontent.com/Joystream/community-repo/master/bounties/overview/bounties-status.json`
    );

    setBounties(response.data?.activeBounties);
  };

  useEffect(() => {
    fetchBounties();
  }, []);

  if (!bounties) return <Loading target={`bounties`} />;

  return (
    <>
      <div className="Bounties m-2 p-1 bg-light">
        <h1>Bounties</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Links</th>
              <th>Opened date</th>
              <th>Reward</th>
              <th>Manager, Co</th>
              <th>Status/Grading</th>
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
    </>
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
    <tr>
      <td>{id}</td>
      <td>{title}</td>
      <td>{description}</td>
      <td>
        {links.map((l) => (
          <>
            <a href={l}>{l}</a>
            <br />
          </>
        ))}
      </td>
      <td>{openedDate}</td>
      <td>${reward}</td>
      <td>{manager?.join(', ')}</td>
      <td>{status}</td>
    </tr>
  );
};
