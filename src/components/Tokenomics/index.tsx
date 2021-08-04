import React from "react";
import Burns from "./Burns";
import Overview from "./Overview";
import ReportBrowser from "./ReportBrowser";
import Loading from "../Loading";

import { Tokenomics } from "../../types";

interface IProps {
  reports: { [key: string]: string };
  tokenomics?: Tokenomics;
  history: any;
}

const CouncilReports = (props: IProps) => {
  const { reports, tokenomics } = props;
  if (!tokenomics) return <Loading />;
  const { exchanges, extecutedBurnsAmount } = tokenomics;

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
      </div>

      <div className="box col-8">
        <ReportBrowser reports={reports} />
      </div>
    </div>
  );
};

export default CouncilReports;
