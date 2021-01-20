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
} from "..";
import { IState } from "../../types";

const Routes = (props: IState) => {
  const { reports, tokenomics } = props;
  return (
    <Switch>
      <Route
        path="/tokenomics"
        render={() => <Tokenomics reports={reports} tokenomics={tokenomics} />}
      />
      <Route
        path="/proposals/:id"
        render={(routeprops) => <Proposal {...routeprops} {...props} />}
      />
      <Route path="/proposals" render={() => <Proposals {...props} />} />
      <Route path="/councils" render={() => <Councils {...props} />} />
      <Route
        path="/forum/threads/:thread"
        render={(routeprops) => <Forum {...routeprops} {...props} />}
      />
      <Route path="/forum" render={() => <Forum {...props} />} />
      <Route path="/mint" render={() => <Mint {...props} />} />
      <Route
        path="/members/:handle"
        render={(routeprops) => <Member {...routeprops} {...props} />}
      />
      <Route path="/members" render={() => <Members {...props} />} />
      <Route path="/calendar" render={() => <Calendar {...props} />} />
      <Route path="/timeline" render={() => <Timeline {...props} />} />
      <Route path="/" render={() => <Dashboard {...props} />} />
    </Switch>
  );
};

export default Routes;
