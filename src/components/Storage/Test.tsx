import React from "react";
import { Button } from "react-bootstrap";
import Provider from "./Provider";
import Loading from "../Loading";

const Test = () => {
  return (
    <div>
      <div className="form-group">
        <input
          className="form-control"
          name="hash"
          value={hash}
          onChange={this.handleChange}
        />
        <Button
          variant="success"
          onClick={() => this.startTest(1)}
          disabled={hash === ``}
        >
          Test selected resource
        </Button>
      </div>
      <div className="form-group">
        <input
          className="form-control"
          name="number"
          value={number}
          onChange={this.handleChange}
        />
        <Button variant="warning" onClick={() => this.startTest(2)}>
          Test {number} out of {assets.length} assets
        </Button>
      </div>
      {(providers.length &&
        providers.map((p) => (
          <Provider
            key={p.url}
            loadAsset={this.loadAsset}
            test={selectedAssets}
            loading={loading}
            startedAt={startedAt}
            {...p}
          />
        ))) || <Loading target="provider list" />}
    </div>
  );
};

export default Test;
