import moment from "moment";
import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Object, Operator } from ".types";
import { gb, testBag } from "./util";

const Bag = (props: { id: number; operator: Operator; objects: Object[] }) => {
  const { id, objects, operator } = props;
  const [color, setColor] = useState(`warning`);
  const [responseTime, setResponseTime] = useState();
  const endpoint = operator?.metadata?.nodeEndpoint;
  useEffect(() => {
    const start = moment();
    testBag(endpoint, objects).then((color) => {
      setResponseTime(moment() - start);
      setColor(color);
    });
  }, [endpoint, objects]);
  const channelId = id.split(":")[2];
  const title = objects
    ? responseTime
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
