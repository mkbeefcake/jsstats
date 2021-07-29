import React from "react";

import { Transaction } from "../../types";

const TransactionView = (props: { transaction: Transaction }) => {
  const {transaction} = props
  return (
    <div className="d-flex flex-row justify-content-between" key={transaction.id}>
      <div>{transaction.amount}</div>
      <div>{transaction.from}</div>
      <div>{transaction.to}</div>
      <div>{transaction.block}</div>
    </div>
  );
};

export default TransactionView;
