import React, { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AppBar, Election, Spinner } from "..";
import { IState } from "../../types";
import IssueTracker from "../IssueTracker";

const Calendar = React.lazy(() => import("../Calendar"));
const { Council } = React.lazy(() => import(".."));
const Councils = React.lazy(() => import("../Councils"));
const Curation = React.lazy(() => import("../Curation"));
const Dashboard = React.lazy(() => import("../Dashboard"));
const Forum = React.lazy(() => import("../Forum"));
const Member = React.lazy(() => import("../Members/Member"));
const Members = React.lazy(() => import("../Members"));
const Mint = React.lazy(() => import("../Mint"));
const Proposals = React.lazy(() => import("../Proposals"));
const Proposal = React.lazy(() => import("../Proposals/Proposal"));
const Spending = React.lazy(() => import("../Proposals/Spending"));
const Timeline = React.lazy(() => import("../Timeline"));
const Tokenomics = React.lazy(() => import("../Tokenomics"));
const Validators = React.lazy(() => import("../Validators"));
const Storage = React.lazy(() => import("../Storage"));
const Transactions = React.lazy(() => import("../Transactions"));
const Bounties = React.lazy(() => import("../Bounties"));
const Burners = React.lazy(() => import("../Burners"));
const ValidatorReport = React.lazy(() => import("../ValidatorReport"));
const FAQ = React.lazy(() => import("../FAQ"));
const KPI = React.lazy(() => import("../KPI"));
const Survey = React.lazy(() => import("../Survey"));

interface IProps extends IState {
  toggleStar: (a: string) => void;
  toggleFooter: () => void;
}

const Routes = (props: IProps) => {
  const { faq, reports, tokenomics, toggleEditKpi } = props;

  return (
    <div>
      <BrowserRouter>
        <div style={{ flexGrow: 1 }}>
          <AppBar />
        </div>
        <div>
          <Suspense fallback={<Spinner />}>
            <Switch>
              <Route
                path="/tokenomics"
                render={(routeprops) => (
                  <Tokenomics
                    {...routeprops}
                    reports={reports}
                    tokenomics={tokenomics}
                  />
                )}
              />
              <Route
                path="/spending"
                render={(routeprops) => <Spending {...routeprops} {...props} />}
              />
              <Route
                path="/proposals/:id"
                render={(routeprops) => <Proposal {...routeprops} {...props} />}
              />
              <Route
                path="/proposals"
                render={() => <Proposals {...props} />}
              />
              <Route
                path="/councils"
                render={(routeprops) => <Councils {...routeprops} {...props} />}
              />
              <Route
                path="/council"
                render={(routeprops) => <Council {...routeprops} {...props} />}
              />
              <Route
                path="/curation"
                render={(routeprops) => <Curation {...routeprops} {...props} />}
              />
              <Route
                path="/forum/threads/:thread"
                render={(routeprops) => <Forum {...routeprops} {...props} />}
              />
              <Route path="/forum" render={() => <Forum {...props} />} />
              <Route
                path="/mint"
                render={(routeprops) => <Mint {...routeprops} {...props} />}
              />
              <Route
                path="/members/:handle"
                render={(routeprops) => <Member {...routeprops} {...props} />}
              />
              <Route
                path="/members"
                render={(routeprops) => <Members {...routeprops} {...props} />}
              />
              <Route
                path="/calendar"
                render={(routeprops) => <Calendar {...routeprops} {...props} />}
              />
              <Route
                path="/timeline"
                render={(routeprops) => <Timeline {...routeprops} {...props} />}
              />
              <Route
                path="/validators"
                render={(routeprops) => (
                  <Validators showList={true} {...routeprops} {...props} />
                )}
              />
              <Route
                path="/validator-report"
                render={(routeprops) => <ValidatorReport />}
              />
              <Route
                path="/storage"
                render={(routeprops) => <Storage {...routeprops} {...props} />}
              />
              <Route
                path="/transactions"
                render={(routeprops) => (
                  <Transactions {...routeprops} {...props} />
                )}
              />
              <Route
                path="/bounties"
                render={(routeprops) => <Bounties {...routeprops} {...props} />}
              />
              <Route
                path="/burners"
                render={(routeprops) => <Burners {...routeprops} {...props} />}
              />
              <Route path="/faq" render={(routeprops) => <FAQ faq={faq} />} />
              <Route
                path="/election"
                render={(routeprops) => <Election {...props} />}
              />
              <Route
                path="/kpi"
                render={(routeprops) => (
                  <KPI toggleEditKpi={toggleEditKpi} faq={faq} />
                )}
              />
              <Route path="/issues" render={(routeprops) => <IssueTracker />} />
              <Route path="/survey" render={(routeprops) => <Survey />} />

              <Route path="/" render={() => <Dashboard {...props} />} />
            </Switch>
          </Suspense>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Routes;
