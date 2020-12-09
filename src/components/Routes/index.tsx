import { Switch, Route } from "react-router-dom";
import { Council, Dashboard, Proposals, Proposal } from "..";

const Routes = (props: any) => {
  return (
    <Switch>
      <Route path="/proposals" render={() => <Proposals {...props} />} />
      <Route
        path="/proposal/:id"
        render={(routeprops) => <Proposal {...routeprops} {...props} />}
      />
      <Route path="/council" render={() => <Council {...props} />} />
      <Route path="/" render={() => <Dashboard {...props} />} />
    </Switch>
  );
};

export default Routes;
