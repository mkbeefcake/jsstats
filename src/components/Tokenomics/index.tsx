import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Overview from "./Overview";
import ReportBrowser from "./ReportBrowser";
import Loading from "../Loading";

import { Tokenomics } from "../../types";

const Back = () => {
  return (
    <Link to={`/`}>
      <Button variant="secondary" className="p-1 m-3">
        back
      </Button>
    </Link>
  );
};

interface IProps {
  reports: { [key: string]: string };
  tokenomics?: Tokenomics;
}

const CouncilReports = (props: IProps) => {
  const { reports, tokenomics } = props;

  return (
    <div className="h-100 py-3 d-flex flex-row justify-content-center">
      <div className="d-flex flex-column text-right  align-items-right">
        <div className="box">
          <h3>Tokenomics</h3>
          {tokenomics ? <Overview {...tokenomics} /> : <Loading />}
        </div>

        <Link to={`/councils`}>
          <Button variant="dark">Previous Councils</Button>
        </Link>

        <Back />
      </div>

      <div className="box col-8">
        <ReportBrowser reports={reports} />
      </div>
    </div>
  );
};

export default CouncilReports;
