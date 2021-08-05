import React from "react";
import Burns from "./Burns";
import Overview from "./Overview";
import ReportBrowser from "./ReportBrowser";
import Loading from "../Loading";
import Chart from "../Chart";

import { Tokenomics } from "../../types";

interface IProps {
  reports: { [key: string]: string };
  tokenomics?: Tokenomics;
  history: any;
}

const CouncilReports = (props: IProps) => {
  const { reports, tokenomics } = props;
  if (!tokenomics) return <Loading target="tokenomics" />;
  const { exchanges, extecutedBurnsAmount } = tokenomics;

  const tokenValue = {};
  exchanges
    .filter((e) => e.date)
    .forEach((e) => {
      const date = e.date.split("T")[0];
      tokenValue[date] = { date, price: (e.price * 1000000).toFixed(1) };
    });

  return (
    <div className="h-100 py-3 d-flex flex-row justify-content-center pb-5">
      <div className="d-flex flex-column text-right  align-items-right">
        <div className="box">
          <h3>Tokenomics</h3>
          {tokenomics ? <Overview {...tokenomics} /> : <Loading />}
        </div>

        <Burns
          exchanges={exchanges}
          extecutedBurnsAmount={extecutedBurnsAmount}
        />

        <div className="box">
          <h3>Token Value</h3>

          <Chart
            data={Object.values(tokenValue).sort((a, b) => a.date - b.date)}
            x="date"
            y="price"
            xLabel="Date"
            yLabel="$"
            scaleY={true}
            pixels={600}
            barStyle={() => `bg-warning`}
          />
        </div>
      </div>

      <div className="box col-8">
        <ReportBrowser reports={reports} />
      </div>
    </div>
  );
};

export default CouncilReports;
