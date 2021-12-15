import React from "react";
import { Button } from "react-bootstrap";
import Provider from "./Provider";
import Loading from "../Loading";

const Test = (props: {
  handleChange: () => void;
  startTest: (number) => void;
  setAssetStatus: (id: string, provider: string, status: string) => void;
  assets: string[];
  hash: string;
  number: number;
  providers;
  selectedAssets: string[];
  loading: {};
}) => {
  const {
    handleChange,
    startTest,
    setAssetStatus,
    assets,
    loading,
    providers,
    hash,
    number,
    selectedAssets,
  } = props;
  if (!providers.length) return <Loading target="providers" />;
  if (!assets.length) return <Loading target="assets" />;
  return (
    <div className="mt-3 m-2 p-2 bg-secondary">
    <h3 className="text-center">Live Speed Test</h3>
      <div className="form-group">
        <input
          className="form-control"
          name="hash"
          value={hash}
          onChange={handleChange}
        />
        <Button
          variant="success"
          onClick={() => startTest(1)}
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
          onChange={handleChange}
        />
        <Button variant="warning" onClick={() => startTest(2)}>
          Test {number} out of {assets.length} assets
        </Button>
      </div>
      {providers.map((p) => (
        <Provider
          key={p.url}
          setAssetStatus={setAssetStatus}
          test={selectedAssets}
          loading={loading}
          {...p}
        />
      ))}
    </div>
  );
};

export default Test;
