import React from "react";
import { Form, Table } from "react-bootstrap";
import axios from "axios";

import { alternativeBackendApis } from "../../config";
//import { mJoy } from "../../lib/util";
import { Transaction } from "../../types";

interface IProps {}

interface IState {
  address: string;
  transactions: Transaction[];
}

const JSG = [
  {
    handle: `BURN ADDRESS`,
    rootKey: `5D5PhZQNJzcJXVBxwJxZcsutjKPqUPydrvpu6HeiBfMaeKQu`,
  },
  {
    handle: `JSG KPI PAYOUT`,
    rootKey: `5GmadBkkBNpFCd83crepSEfvRW5CNMfb3CQVMxV3ZQXaqZgd`,
  },
];

class Transactions extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { address: "" };
    this.accountTxFilterChanged = this.accountTxFilterChanged.bind(this);
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    let { address } = this.state;

    if (address !== prevState.address) {
      console.log(`Fetching transactions`);
      const backend = `${alternativeBackendApis}/transactions?addr=${address}`;
      axios.get(backend).then((response) => {
        this.setState({ ...this.state, transactions: response.data });
      });
    }
  }

  accountTxFilterChanged(address: string) {
    if (this.state.address !== address) this.setState({ address: address });
  }

  render() {
    const { members } = this.props;
    const { address, transactions } = this.state;
    const getHandle = (key: string) =>
      members.concat(JSG).find(({ rootKey }) => rootKey === key)?.handle || key;
    return (
      <div className="box">
        <h3>Transactions</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="address"
              placeholder="Wallet account(48 character string starting with 5)"
              onChange={(e) => this.accountTxFilterChanged(e.target.value)}
              value={address}
            />
          </Form.Group>
        </Form>
        <>
          {!transactions ? (
            <h4>Select an address</h4>
          ) : transactions.length === 0 ? (
            <h4>No records found</h4>
          ) : (
            <Table
              striped
              bordered
              hover
              size="sm"
              style={{ color: "inherit" }}
            >
              <thead>
                <tr>
                  <th>Block</th>
                  <th>M tJOY</th>
                  <th>From</th>
                  <th>To</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.block}</td>
                    <td>{(tx.amount / 1000000).toFixed(6)}</td>
                    <td onClick={() => this.accountTxFilterChanged(tx.from)}>
                      {getHandle(tx.from)}
                    </td>
                    <td onClick={() => this.accountTxFilterChanged(tx.to)}>
                      {getHandle(tx.to)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      </div>
    );
  }
}

export default Transactions;
