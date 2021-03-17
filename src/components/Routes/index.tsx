import { Switch, Route } from "react-router-dom";
import {
  Calendar,
  Councils,
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
} from "..";
import { IState } from "../../types";

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
        render={(routeprops) => (
          <Proposal
            fetchProposal={props.fetchProposal}
            {...routeprops}
            {...props}
          />
        )}
      />
      <Route path="/proposals" render={() => <Proposals {...props} />} />
      <Route
        path="/councils"
        render={(routeprops) => <Councils {...routeprops} {...props} />}
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
      <Route path="/timeline" render={() => <Timeline {...props} />} />
      <Route
        path="/validators"
        render={(routeprops) => <Validators {...routeprops} {...props} />}
      />
      <Route path="/" render={() => <Dashboard {...props} />} />
    </Switch>
  );
};

export default Routes;
