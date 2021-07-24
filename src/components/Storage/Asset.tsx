import React, { useEffect } from "react";
import moment from "moment";

import { Link } from "react-router-dom";

const Asset = (props: {
  loadAsset: (string, any, string) => void;
  provider: string;
  id: string;
  status: string;
  startedAt: any;
  finishedAt: any;
}) => {
  const { loadAsset, provider, id, status, startedAt, finishedAt } = props;
  const bg = {
    undefined: "warning",
    loading: "warning",
    loaded: "success",
    failed: "danger",
  };
  //console.log(status, bg[status]);
  useEffect(() => loadAsset(id, provider, "loading"), []);

  const url = `${provider}asset/v0/${id}`;

  return (
    <div
      className={`display-block bg-${bg[status]} p-1 mr-1`}
      style={{ width: `50px` }}
    >
      <a href={url} title={id}>
        {finishedAt
          ? moment(finishedAt).diff(startedAt) / 1000
          : moment().diff(startedAt) / 1000}
        s
        <img
          onLoad={() =>
            status === "loaded" || loadAsset(id, provider, "loaded")
          }
          onError={() =>
            status === "failed" || loadAsset(id, provider, "failed")
          }
          className="hidden"
          alt={id}
          style={{ display: "none" }}
          src={url}
        />
      </a>
    </div>
  );
};

export default Asset;
