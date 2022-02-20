import { useState, useEffect, useMemo } from "react";
import { Badge } from "react-bootstrap";
import Metadata from "./Metadata";
import Bags from "./Bags";
import StatusBadge from "./StatusBadge";
import { testQN } from "./util";
import { Operator, Bucket } from "./types";

const BucketRow = (props: { isDP: boolean; bucket: Bucket }) => {
  const { isDP, bucket } = props;
  const { id, distributing, acceptingNewBags, bags, operatorMetadata } = bucket;
  const op = useMemo(
    () => (isDP ? bucket.operators[0] : { metadata: operatorMetadata }),
    [isDP]
  );
  const [show, setShow] = useState(false);
  const [hasQN, setQN] = useState();
  const [qnInfo, setInfo] = useState(``);
  const [qnUrl, setUrl] = useState();
  const [families, setFams] = useState([]);
  useEffect(
    () => qnUrl || testQN(op, setQN, setInfo, setUrl, setFams),
    [op, !qnUrl]
  );
  let qnTitle = `Not set.`;
  if (qnInfo.length) {
    const no = families.length ? "" : "no ";
    qnTitle = `${no}functional QueryNode: ${families.length} Bucket Families received.\n${qnInfo}`;
  } else if (qnUrl?.length) qnTitle = `Checking..`;

  const dTitle = (distributing ? "" : "not ") + "distributing";
  const aTitle = (acceptingNewBags ? "" : "not ") + "accepting new bags";
  return (
    <>
      <div key={id} className="d-flex flex-row">
        <a href={qnUrl}>
          <StatusBadge status={hasQN} label={"Q"} title={qnTitle} />
        </a>

        <div className="col-1 text-right d-flex justify-content-between">
          <h3>{id}</h3>
          {isDP && (
            <StatusBadge status={distributing} label={"D"} title={dTitle} />
          )}
        </div>
        <StatusBadge status={acceptingNewBags} label={"A"} title={aTitle} />
        <div className="col-1" onClick={() => setShow(!show)}>
          {bags.length} bags
        </div>
        <OperatorFields operator={op} />
      </div>
      {show ? <Bags show={show} bucketId={id} bags={bags} operator={op} /> : ``}
    </>
  );
};

export default BucketRow;

const OperatorFields = (props: { operator: Operator }) => {
  const { operator } = props;
  if (!operator) return <div className="col-7">No operator assigned.</div>;
  const { workerId, member, metadata } = operator;
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
