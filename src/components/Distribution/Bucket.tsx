import { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import Metadata from "./Metadata";
import Bags from "./Bags";
import StatusBadge from "./StatusBadge";
import { testQN } from "./util";
import { Operator, Bucket } from "./types";

const BucketRow = (props: { isDP: boolean; bucket: Bucket }) => {
  const [show, setShow] = useState(false);
  const [hasQN, setQN] = useState(false);
  const [qnTitle, setTitle] = useState(``);
  const { isDP, bucket } = props;
  const { id, distributing, acceptingNewBags, bags, operatorMetadata } = bucket;
  const operator = isDP ? bucket.operators[0] : { metadata: operatorMetadata };

  useEffect(() => testQN(operator, setQN, setTitle));

  return (
    <>
      <div key={id} className="d-flex flex-row" onClick={() => setShow(!show)}>
        <StatusBadge
          status={hasQN}
          label={"Q"}
          title={(hasQN ? "" : "no ") + "functional query node: " + qnTitle}
        />

        <div className="col-1 text-right d-flex justify-content-between">
          <h3>{id}</h3>
          {isDP && (
            <StatusBadge
              status={distributing}
              label={"D"}
              title={(distributing ? "" : "not ") + "distributing"}
            />
          )}
        </div>
        <StatusBadge
          status={acceptingNewBags}
          label={"A"}
          title={(acceptingNewBags ? "" : "not ") + "accepting new bags"}
        />
        <div className="col-1">{bags.length} bags</div>
        <OperatorFields operator={operator} />
      </div>
      {show ? (
        <Bags show={show} bucketId={id} bags={bags} operator={operator} />
      ) : (
        ``
      )}
    </>
  );
};

export default BucketRow;

const OperatorFields = (props: { operator: Operator }) => {
  if (!props.operator) return <div className="col-7">No operator info.</div>;
  const { workerId, member, metadata } = props.operator;
  return (
    <>
      <div
        className="col-1"
        title={workerId ? `worker ${workerId}` : `No worker info.`}
      >
        {member ? <Badge>{member.handle}</Badge> : ``}
      </div>
      <Badge
        title={metadata?.nodeEndpoint || `No metadata set.`}
        className="col-3 text-left overflow-hidden"
      >
        {metadata?.extra}
      </Badge>
      <Metadata metadata={metadata} />
    </>
  );
};
