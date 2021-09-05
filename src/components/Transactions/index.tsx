import React from "react";
import { Form, Table} from "react-bootstrap";
import axios from "axios";

import { alternativeBackendApis } from "../../config"

import { Transaction } from "../../types";

interface IProps {
}

interface IState {
  address: string
  transactions: Transaction[];
}

class Transactions extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      address: '',
      transactions: [] as Transaction[]
    };
    this.accountTxFilterChanged = this.accountTxFilterChanged.bind(this);
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    let { address } = this.state;

    if(address !== prevState.address) {
      console.log(`Fetching transactions`);
      const backend = `${alternativeBackendApis}/transactions?addr=${address}`;
      axios.get(backend).then((response) => {this.setState({...this.state, transactions: response.data})});
    }
  }

  accountTxFilterChanged(address: string) {
    if(this.state.address !== address) {
      this.setState({...this.state, address: address });
    }
  }
  
  render() {

    const { address, transactions } = this.state;

    return (
      <div className="box">
        <h3>Transactions</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="address" placeholder="Wallet account(48 character string starting with 5)" onChange={(e) => this.accountTxFilterChanged(e.target.value)} value={address}/>
          </Form.Group>
        </Form>
        <>
        { (!transactions || transactions.length === 0) ? <h4>No records found</h4> :
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>tJOY</th>
                <th>From</th>
                <th>To</th>
                <th>Block</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                      <tr key={tx.id}>
                        <td>{tx.amount}</td>
                        <td>{tx.from}</td>
                        <td>{tx.to}</td>
                        <td>{tx.block}</td>
                      </tr>
                    ))}
            </tbody>
          </Table>
        } </>
      </div>
    );
  }
}

export default Transactions;
