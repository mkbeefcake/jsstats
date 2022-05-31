import { useState } from "react";
import { Button } from "react-bootstrap";

const Provider = (props: { results: any[] }) => {
  const [expand, setExpand] = useState(false);
  const results = props.results.filter(
    (r) => moment(r.timestamp).valueOf() + 24 * 3600 * 1000 > moment().valueOf()
  );
  if (!results.length) return <div />;
  const totalLatency = results.reduce((sum, r) => +sum + +r.latency, 0);
  const avgLatency = totalLatency / results.length;
  return (
    <div className="d-flex flex-column" onClick={() => setExpand(!expand)}>
      <div className="d-flex flex-row mx-2 p-1">
        <Button
          variant={expand ? "light" : "dark"}
          className="col-5"
          title="click to expand"
        >
          {props.url}
        </Button>
        <Button variant="danger" className="col-1 mx-1">
          {results.length} errors
        </Button>
        <Button variant="success" className="col-1">
          {avgLatency.toFixed()} ms
        </Button>
      </div>

      <div className="d-flex flex-column px-2">
        {expand &&
          results.slice(0, 1000).map((r) => (
            <div key={r.id} className="d-flex flex-row">
              <Button
                variant="dark"
                className="col-2 m-1"
                title={`lifetime: ${moment(r.timestamp)
                  .add(24 * 3600 * 1000)
                  .fromNow(true)}`}
              >
                {moment(r.createdAt).format(`DD-MMM-YY HH:mm:ss.SSS`)}
              </Button>
              <Button
                variant="danger"
                className="col-1 p-0 m-1"
                title="open in a new tab to see original response"
              >
                <a href={r.url}>{r.objectId}</a>
              </Button>
              <Button
                variant="warning"
                className="col-4 m-1"
                title="error message"
              >
                {r.status}
              </Button>
              <Button
                variant="success"
                className="col-1 m-1"
                title="server responded within this time"
              >
                {r.latency}ms
              </Button>
              <Button
                variant="light"
                className="col-2 m-1"
                title="click to see on the map where requests where made from (not yet implemented)"
              >
                {r.origin}
              </Button>

              <Button
                variant="light"
                className="p-0 m-1"
                title="click to open channel"
              >
                <a href={`https://play.joystream.org/channel/${r.channelId}`}>
                  Channel {r.channelId}
                </a>
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Provider