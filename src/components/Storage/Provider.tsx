import React from "react";
import Asset from "./Asset";

const Provider = (props: {
  loadAsset: (id: string, provider: string, status: string) => void;
  loading: any[];
  startedAt: string | boolean;
  test: string[];
  url: string;
}) => {
  const { loadAsset, loading, test, url, startedAt } = props;

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
            loadAsset={loadAsset}
            id={a}
            provider={url}
            startedAt={startedAt}
            {...loading[`${url}-${a}`]}
          />
        ))}
    </div>
  );
};

export default Provider;
