import React from "react";
import { Paper } from "@material-ui/core";
import Burns from "./Burns";
import Overview from "./Overview";
import DollarPoolChanges from "./DollarPoolChanges";
import ReportBrowser from "./ReportBrowser";
import TokenValue from "./TokenValue";
import Loading from "../Loading";

import { Tokenomics } from "../../types";

interface IProps {
  reports: { [key: string]: string };
  tokenomics?: Tokenomics;
  history: any;
}

const TokenStats = (props: IProps) => {
  const { reports, tokenomics } = props;
  if (!tokenomics) return <Loading target="tokenomics" />;
  const { dollarPoolChanges, exchanges, extecutedBurnsAmount } = tokenomics;

  return (
    <Paper className="d-flex flex-column flex-grow-1 p-2">
      <h2>Tokenomics</h2>
      <Overview {...tokenomics} />
      <Burns
        exchanges={exchanges}
        extecutedBurnsAmount={extecutedBurnsAmount}
      />
      <TokenValue exchanges={exchanges} />
      <DollarPoolChanges dollarPoolChanges={dollarPoolChanges} />
      <ReportBrowser reports={reports} />
    </Paper>
  );
};

export default TokenStats;
