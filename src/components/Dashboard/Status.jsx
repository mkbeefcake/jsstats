import React from "react";

const Status = (props: { connected: boolean, fetching: string }) => {
  const { connected, fetching } = props;
  if (!connected) return <div className="connecting">Connecting ..</div>;
  if (!fetching.length) return <div />;
  return <div className="connecting">Fetching {fetching}</div>;
};

export default Status;
