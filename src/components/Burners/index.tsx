import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

import { alternativeBackendApis } from "../../config";

import { Burner } from "../../types";

interface IProps {}

interface IState {
  burners: Burner[];
}

class Burners extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const backend = `${alternativeBackendApis}/burners`;
    axios.get(backend).then((response) => {
      this.setState({ burners: response.data });
    });
  }

  render() {
    const { burners } = this.state;
    const { members } = this.props;

    return (
      <div className="box">
        <h3>Top Token Burners</h3>

        {!burners ? (
          <h4>Loading</h4>
        ) : burners.length === 0 ? (
          <h4>No records found</h4>
        ) : (
          <Table striped bordered hover size="sm" style={{ color: "inherit" }}>
            <thead>
              <tr>
                <th>Wallet</th>
                <th>Amount Burned (M tJOY)</th>
              </tr>
            </thead>
            <tbody>
              {burners.map((brn) => (
                <tr key={brn.wallet}>
                  <td>
                    <Member members={members} account={brn.wallet} />
                  </td>
                  <td>{(brn.totalburned / 1000000).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    );
  }
}

const Member = (props: { members: Member[]; account: string }) => {
  const { members, account } = props;
  const member = members.find((member) => member.rootKey === account);
  if (!member) return account;
  return <Link to={`/members/${member.handle}`}>{member.handle}</Link>;
};

export default Burners;
