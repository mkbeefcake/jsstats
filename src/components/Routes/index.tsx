import React, { Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { Election, Spinner } from "..";
import { IState } from "../../types";
import IssueTracker from "../IssueTracker";

const Calendar = React.lazy(() => import("../Calendar"));
//const Council = React.lazy(() => import("../Dashboard/Council"));
const Councils = React.lazy(() => import("../Councils"));
const Curation = React.lazy(() => import("../Curation"));
const Dashboard = React.lazy(() => import("../Dashboard"));
const Forum = React.lazy(() => import("../Forum"));
const Member = React.lazy(() => import("../Members/Member"));
const Members = React.lazy(() => import("../Members"));
const Mint = React.lazy(() => import("../Mint"));
const Proposals = React.lazy(() => import("../Proposals"));
const Proposal = React.lazy(() => import("../Proposals/Proposal"));
const Spending = React.lazy(() => import("../Spending"));
const Timeline = React.lazy(() => import("../Timeline"));
const Tokenomics = React.lazy(() => import("../Tokenomics"));
const Validators = React.lazy(() => import("../Validators"));
//const Storage = React.lazy(() => import("../Storage"));
const Distribution = React.lazy(() => import("../Distribution"));
const Transactions = React.lazy(() => import("../Transactions"));
const Bounties = React.lazy(() => import("../Bounties"));
const Burners = React.lazy(() => import("../Burners"));
const ValidatorReport = React.lazy(() => import("../ValidatorReport"));
const FAQ = React.lazy(() => import("../FAQ"));
const KPI = React.lazy(() => import("../KPI"));
const Survey = React.lazy(() => import("../Survey"));
const Grading = React.lazy(() => import("../Grading"));
const Data = React.lazy(() => import("../Data"));
const Openings = React.lazy(() => import("../Openings"));
const Notes = React.lazy(() => import("../Notes"));
const Media = React.lazy(() => import("../Media"));
const Settings = React.lazy(() => import("../Settings"));

interface IProps extends IState {
  toggleStar: (a: string) => void;
  toggleFooter: () => void;
}

const Routes = (props: IProps) => {
  const { faq, proposals, toggleEditKpi } = props;

  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route
          path="/tokenomics"
          render={(routeprops) => (
            <Tokenomics
              {...routeprops}
              validators={{
                count: props.validators?.length,
                reward: props.status?.lastReward,
                stakes: props.stakes,
              }}
              block={props.status?.block?.id}
              proposals={proposals.filter((p) => p.type === "spending")}
              mints={props.mints}
              council={props.council}
              reports={props.reports}
              tokenomics={props.tokenomics}
              workers={props.workers}
            />
          )}
        />
        <Route
          path="/settings"
          render={(routeprops) => <Settings {...routeprops} {...props} />}
        />
        <Route
          path="/notes"
          render={(routeprops) => <Notes {...routeprops} {...props} />}
        />
        <Route
          path="/openings"
          render={(routeprops) => <Openings {...routeprops} {...props} />}
        />
        <Route
          path="/grading"
          render={(routeprops) => <Grading {...routeprops} {...props} />}
        />
        <Route
          path="/data"
          render={(routeprops) => <Data {...routeprops} {...props} />}
        />
        <Route
          path="/bounties"
          render={(routeprops) => <Bounties {...routeprops} {...props} />}
        />
        <Route
          path="/spending"
          render={(routeprops) => <Spending {...routeprops} {...props} />}
        />
        <Route
          path="/proposals/:id"
          render={(routeprops) => <Proposal {...routeprops} {...props} />}
        />
        <Route path="/proposals" render={() => <Proposals {...props} />} />
        <Route
          path="/councils"
          render={(routeprops) => <Councils {...routeprops} {...props} />}
        />
        <Route
          path="/council"
          render={(routeprops) => <Councils {...routeprops} {...props} />}
        />
        <Route
          path="/curation"
          render={(routeprops) => <Curation {...routeprops} {...props} />}
        />
        <Route
          path="/media"
          render={(routeprops) => <Media {...routeprops} {...props} />}
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
          render={(routeprops) => (
            <ValidatorReport
              lastBlock={props.status?.block?.id}
              validators={props.validators}
            />
          )}
        />
        <Route
          path="/storage"
          render={(routeprops) => <Distribution {...routeprops} {...props} />}
        />
        <Route
          path="/distribution"
          render={(routeprops) => <Distribution {...routeprops} {...props} />}
        />
        <Route
          path="/transactions"
          render={(routeprops) => <Transactions {...routeprops} {...props} />}
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
          render={(routeprops) => (
            <Election
              block={props.status?.block?.id}
              round={props.status?.election?.round}
              stage={props.status?.election?.stage}
              termEndsAt={props.status?.election?.termEndsAt}
              domain={props.domain}
              election={props.election}
            />
          )}
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
  );
};

export default Routes;
