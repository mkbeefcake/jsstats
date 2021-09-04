import React from "react";
import { domain } from "../../../config";
import { DollarPoolChange } from "../../../types";
import moment from "moment";

const DollarPoolChanges = (props: {
  dollarPoolChanges: DollarPoolChange[];
}) => {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row font-weight-bold">
        <div className="col-1">Block</div>
        <div className="col-2 text-right">Date</div>
        <div className="col-1 text-right">Change</div>
        <div className="col-3">Reason</div>
        <div className="col-1 text-right">Dollar Pool</div>
        <div className="col-1 text-right">Rate</div>
        <div className="col-1 text-right">Issuance</div>
      </div>

      {props.dollarPoolChanges
        .sort((a, b) => moment.utc(b.blockTime).diff(moment.utc(a.blockTime)))
        .map((c) => (
          <PoolChangeRow key={c.blockTime} {...c} />
        ))}
    </div>
  );
};

export default DollarPoolChanges;

const PoolChangeRow = (props: DollarPoolChange) => {
  const {
    blockHeight,
    blockTime,
    change,
    reason,
    issuance,
    valueAfter,
    rateAfter,
  } = props;
  const color = change > 0 ? "text-success" : "text-danger";
  return (
    <div className={`d-flex flex-row ${color}`}>
      <a className="col-1" href={`${domain}/#/explorer/query/${blockHeight}`}>
        #{blockHeight}
      </a>
      <div className="col-2 text-right">{blockTime}</div>
      <div className="col-1 text-right">{change.toFixed(2)} $</div>
      <div className="col-3">{reason}</div>
      <div className="col-1 text-right">{valueAfter.toFixed()} $</div>
      <div className="col-1 text-right">
        {(rateAfter * 1000000).toFixed(1)} $ / M
      </div>
      <div className="col-1 text-right">
        {(issuance / 1000000).toFixed(1)} M
      </div>
    </div>
  );
};
