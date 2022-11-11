import moment from "moment";
import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Object, Operator } from ".types";
import { gb, testBag } from "../../lib/util";

const Bag = (props: { id: number; operator: Operator; objects: Object[] }) => {
  const { id, objects, operator } = props;
  const [color, setColor] = useState(`warning`);
  const [responseTime, setResponseTime] = useState();
  useEffect(() => {
    const start = moment();
    if (!operator?.metadata?.nodeEndpoint)
      return console.error(`No endpoint found.`);
    testBag(operator.metadata.nodeEndpoint, objects).then((color) => {
      setResponseTime(moment() - start);
      setColor(color);
    });
  }, [operator?.metadata?.nodeEndpoint, objects]);
  const channelId = id.split(":")[2];
  const title = objects
    ? !objects.length
      ? `channel is empty`
      : responseTime
      ? responseTime + `ms`
      : `sent request`
    : `fetching list`;
  const size = objects?.reduce((sum: number, o) => sum + +o.size, 0) || 0;
  const content = channelId + (size ? ` (${gb(size)})` : ``);
  return (
    <Badge variant={color} title={title}>
      {content}
    </Badge>
  );
};

export default Bag;
