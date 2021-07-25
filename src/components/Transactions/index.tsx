import React from "react";
import { Loading } from "..";
import { ListGroup } from "react-bootstrap";
import TransactionView from "./Transaction";

import { Transaction } from "../../types";

const Transactions = (props: { transactions: Transaction[] }) => {
  const { transactions } = props;

  if (!transactions) return <Loading target="transactions" />;

  return (
    <div>
      <h3>Transactions</h3>
      <ListGroup>
        <ListGroup.Item key={`header`}>
          <div className="d-flex flex-row justify-content-between">
            <div>tJOY</div>
            <div>from</div>
            <div>to</div>
          </div>
        </ListGroup.Item>

        {transactions.map((t, i) => (
          <ListGroup.Item key={i}>
            <TransactionView transaction={t} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Transactions;
