import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Object, Operator } from ".types";
import { gb, testBag } from "./util";

const Bag = (props: { id: number; operator: Operator; objects: Object[] }) => {
  const { id, objects, operator } = props;
  const [color, setColor] = useState(`warning`);
  const endpoint = operator?.metadata?.nodeEndpoint;
  useEffect(
    () => testBag(endpoint, objects).then((color) => setColor(color)),
    [endpoint, objects]
  );
  const channelId = id.split(":")[2];
  const size = objects?.reduce((o, sum: number) => sum + +o.size, 0) || 0;
  return (
    <Badge variant={color} title={gb(size)}>
      {channelId}
    </Badge>
  );
};

export default Bag;
