import { useEffect, useState } from "react";
import BagBubble from "./Bag";
import { getBucketObjects } from "./util";

const Bags = (props: { show: boolean; bags: Bag[]; operator: Operator }) => {
  const { bucketId, bags, operator } = props;
  const [bagsWithObjects, setBags] = useState([]);
  useEffect(
    () =>
      getBucketObjects(bucketId).then((bags) => bags.length && setBags(bags)),
    [bucketId]
  );
  const findBag = (id: string) => bagsWithObjects.find((b) => b.id === id);
  return (
    <div>
      {bags.map((b) => (
        <BagBubble
          key={b.id}
          {...b}
          objects={findBag(b.id)?.objects}
          operator={operator}
        />
      ))}
    </div>
  );
};

export default Bags;
