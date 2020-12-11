import { Switch, Route } from "react-router-dom";
import { Council, Dashboard, Proposals, Proposal } from "..";
import { IState } from "../../types";

const Routes = (props: IState) => {
  return (
    <Switch>
      <Route
        path="/proposals/:id"
        render={(routeprops) => <Proposal {...routeprops} {...props} />}
      />
      <Route path="/proposals" render={() => <Proposals {...props} />} />
      <Route path="/council" render={() => <Council {...props} />} />
      <Route path="/" render={() => <Dashboard {...props} />} />
    </Switch>
  );
};

export default Routes;
