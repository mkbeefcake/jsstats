import { Switch, Route } from "react-router-dom";
import {
  Calendar,
  Councils,
  Curation,
  Dashboard,
  Forum,
  Member,
  Members,
  Mint,
  Proposals,
  Proposal,
  Timeline,
  Tokenomics,
  Validators,
  Spending,
  Storage,
  Transactions,
  Bounties,
  Burners,
} from "..";

import ValidatorReport from "../Validators/ValidatorReport";

import { IState } from "../../types";
import ValidatorReport from "../ValidatorReport/ValidatorReport";

interface IProps extends IState {
  toggleStar: (a: string) => void;
  toggleFooter: () => void;
}

const Routes = (props: IProps) => {
  const { reports, tokenomics } = props;
  return (
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
      <Route path="/proposals" render={() => <Proposals {...props} />} />
      <Route
        path="/councils"
        render={(routeprops) => <Councils {...routeprops} {...props} />}
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
        render={(routeprops) => <Validators {...routeprops} {...props} />}
      />
      <Route
        path="/validator-report"
        render={(routeprops) => <ValidatorReport {...routeprops} {...props} />}
      />
      <Route
        path="/storage"
        render={(routeprops) => <Storage {...routeprops} {...props} />}
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
      <Route path="/" render={() => <Dashboard {...props} />} />
    </Switch>
  );
};

export default Routes;
