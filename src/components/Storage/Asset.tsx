import React from "react";
import moment from "moment";

const Asset = (props: {
  setAssetStatus: (string, any, string) => void;
  provider: string;
  id: string;
  status: string;
  startedAt: any;
  finishedAt: any;
}) => {
  const { setAssetStatus, provider, id, status, startedAt, finishedAt } = props;

  const url = `${provider}asset/v0/${id}`;
  const bg = {
    undefined: "light",
    loading: "warning",
    loaded: "success",
    failed: "danger",
  };

  if (!status === "loading")
    return (
      <div
        className={`display-block bg-${bg[status]} p-1 mr-1`}
        style={{ width: `50px` }}
      >
        waiting
      </div>
    );

  return (
    <div
      className={`display-block bg-${bg[status]} p-1 mr-1`}
      style={{ width: `50px` }}
    >
      <a href={url} title={id}>
        {!status
          ? "waiting"
          : finishedAt
          ? moment(finishedAt).diff(startedAt) / 1000
          : moment().diff(startedAt) / 1000}

        {status === "loading" ? (
          <img
            onLoad={() =>
              status === "loaded" || setAssetStatus(id, provider, "loaded")
            }
            onError={() =>
              status === "failed" || setAssetStatus(id, provider, "failed")
            }
            className="hidden"
            alt={id}
            style={{ display: "none" }}
            src={url}
          />
        ) : (
          <div />
        )}
      </a>
    </div>
  );
};

export default Asset;
