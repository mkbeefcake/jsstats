import React from "react";
import { domain } from "../../../config";
import { DollarPoolChange } from "../../../types";
import moment from "moment";

const DollarPoolChanges = (props: {
  dollarPoolChanges: DollarPoolChange[];
}) => {
  return (
    <div className="d-flex flex-column mx-5">
      <div className="d-flex flex-row font-weight-bold">
        <div className="col-1">Block</div>
        <div className="col-1 text-right">Date</div>
        <div className="col-1 text-right">Change</div>
        <div className="col-3">Reason</div>
        <div className="col-1 text-right">FiatPool</div>
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
  return (
    <div className={`py-1 d-flex flex-row bg-${change > 0 ? "success" : "danger"}`}>
      <a className="col-1" href={`${domain}/#/explorer/query/${blockHeight}`}>
        #{blockHeight}
      </a>
      <div className="col-1 text-right">{blockTime.split(`T`)[0]}</div>
      <div className="col-1 text-right">{change.toFixed(2)}</div>
      <div className="col-3">{reason}</div>
      <div className="col-1 text-right">{valueAfter.toFixed()}</div>
      <div className="col-1 text-right">
        {(rateAfter * 1000000).toFixed(1)}
      </div>
      <div className="col-1 text-right">
        {(issuance / 1000000).toFixed(1)}
      </div>
    </div>
  );
};
