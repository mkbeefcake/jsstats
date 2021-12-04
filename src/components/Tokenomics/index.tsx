import React from "react";
import { Paper } from "@material-ui/core";
import Burns from "./Burns";
import Overview from "./Overview";
import DollarPoolChanges from "./DollarPoolChanges";
import ReportBrowser from "./ReportBrowser";
import TokenValue from "./TokenValue";
import Spending from "./Spending";
import Groups from "./Groups";
import Loading from "../Loading";
import { groupsMinting } from "./lib";

import { Tokenomics } from "../../types";

interface IProps {
  reports: { [key: string]: string };
  tokenomics?: Tokenomics;
  history: any;
}

const TokenStats = (props: IProps) => {
  if (!props.tokenomics) return <Loading target="tokenomics" />;
  const { reports, tokenomics, council, mints, workers, validators } = props;
  const { exchanges, extecutedBurnsAmount, totalIssuance } = tokenomics;
  const groups = groupsMinting(council, workers, validators);

  return (
    <Paper className="d-flex flex-column flex-grow-1 p-2 px-3 m-auto">
      <h1 className="m-3 text-center">Tokenomics</h1>
      <Overview groups={groups} tokenomics={tokenomics} />
      <Spending groups={groups} price={tokenomics.price} />
      <Groups mints={mints} workers={workers} price={tokenomics.price} />
      <TokenValue exchanges={exchanges} />
      <Burns
        exchanges={exchanges}
        executed={extecutedBurnsAmount / 1000000}
        percent={extecutedBurnsAmount / (totalIssuance + extecutedBurnsAmount)}
      />
      <DollarPoolChanges dollarPoolChanges={tokenomics.dollarPoolChanges} />
    </Paper>
  );
};

export default TokenStats;
