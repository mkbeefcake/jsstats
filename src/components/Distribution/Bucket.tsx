import { useState } from "react";
import { Badge } from "react-bootstrap";
import Metadata from "./Metadata";
import Bags from "./Bags";
import StatusBadge from "./StatusBadge";
import { Operator, Bucket } from "./types";

const BucketRow = (props: { bucket: Bucket }) => {
  const [show, setShow] = useState(false);
  const { id, distributing, acceptingNewBags, bags, operators } = props.bucket;
  return (
    <>
      <div key={id} className="d-flex flex-row" onClick={() => setShow(!show)}>
        <h3>{id}</h3>
        <StatusBadge status={distributing} label={"D"} title={"distributing"} />
        <StatusBadge
          status={acceptingNewBags}
          label={"A"}
          title={"accepting new bags"}
        />
        <div className="col-1 p-2">{bags.length} bags</div>
        <OperatorFields operator={operators[0]} />
      </div>
      {show ? (
        <Bags show={show} bucketId={id} bags={bags} operator={operators[0]} />
      ) : (
        ``
      )}
    </>
  );
};

export default BucketRow;

const OperatorFields = (props: { operator: Operator }) => {
  if (!props.operator) return <div className="col-7" />;
  const { workerId, member, metadata } = props.operator;
  const statusUrl = metadata?.nodeEndpoint
    ? metadata.nodeEndpoint + `api/v1/status`
    : ``;
  return (
    <>
      <div className="col-1" title={`worker ${workerId}`}>
        {member ? <Badge>{member.handle}</Badge> : ``}
      </div>
      <Badge title={statusUrl} className="col-3 text-left">
        {metadata?.extra}
      </Badge>
      <Metadata metadata={metadata} />
    </>
  );
};
