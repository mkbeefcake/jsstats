import React from "react";

import { Transaction } from "../../types";

const TransactionView = (props: { transaction: Transaction }) => {
  const { param0, param1, param2 } = props.transaction.data;
  return (
    <div className="d-flex flex-row justify-content-between">
      <div>{param2.value}</div>
      <div>{param0.value}</div>
      <div>{param1.value}</div>
    </div>
  );
};

export default TransactionView;
