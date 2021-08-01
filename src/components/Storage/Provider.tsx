import React from "react";
import Asset from "./Asset";

const Provider = (props: {
  setAssetStatus: (id: string, provider: string, status: string) => void;
  loading: any[];
  startedAt: string | boolean;
  test: string[];
  url: string;
}) => {
  const { setAssetStatus, loading, test, url, startedAt } = props;

  return (
    <div key={url} className="m-2 d-flex flex-row">
      <div
        className="text-info p-1 mr-2"
        style={{ minWidth: `30%`, fontSize: `1.1em` }}
      >
        <a href={url}>{url}</a>
      </div>

      {loading &&
        test.map((a) => (
          <Asset
            key={`${url}-${a}`}
            setAssetStatus={setAssetStatus}
            id={a}
            provider={url}
            {...loading[`${url}-${a}`]}
          />
        ))}
    </div>
  );
};

export default Provider;
