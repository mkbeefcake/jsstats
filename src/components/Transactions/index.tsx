import React from "react";
import { ListGroup, Form} from "react-bootstrap";
import TransactionView from "./Transaction";
import axios from "axios";

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
      const backend = `https://validators.joystreamstats.live/transactions?addr=${address}`;

      axios.get(backend).then((response) => {this.setState({...this.state, transactions: response.data})});
    }
  }

  accountTxFilterChanged(address: string) {
    if(this.state.address !== address) {
      console.log(`accountTxFilterChanged ${address}`);
      this.setState({...this.state, address: address });
    }
  }
  
  render() {

    const { address, transactions } = this.state;

    return (
      <div>
        <h3>Transactions</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="address" placeholder="Wallet account" onChange={(e) => this.accountTxFilterChanged(e.target.value)} value={address}/>
            <Form.Text className="text-muted">
              48 character string starting with 5
            </Form.Text>
          </Form.Group>
        </Form>
        <>
        { (!transactions || transactions.length === 0) ? <div/> :
        <ListGroup>
          <ListGroup.Item key={`header`}>
            <div className="d-flex flex-row justify-content-between">
              <div>tJOY</div>
              <div>from</div>
              <div>to</div>
              <div>block</div>
            </div>
          </ListGroup.Item>
          {transactions.map(tx => (
            <ListGroup.Item key={tx.id}>
              <TransactionView transaction={tx} key={tx.id}/>
            </ListGroup.Item>
          ))}
        </ListGroup>
        } </>
      </div>
    );
  }
}

export default Transactions;
