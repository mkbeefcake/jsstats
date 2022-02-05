import { useState, useEffect } from "react";
import { Loading } from "..";
import Bucket from "./Bucket";
import { getDistributionBuckets } from "./util";

const Distribution = (props: {
  workers: { distributionWorkingGroup?: Worker[] };
}) => {
  const [buckets, setBuckets] = useState([]);
  useEffect(() => {
    const update = () =>
      getDistributionBuckets(props.workers?.distributionWorkingGroup).then(
        (buckets) => buckets.length && setBuckets(buckets)
      );
    update();
    setTimeout(update, 30000);
  }, [props.workers?.distributionWorkingGroup]);
  return (
    <div className="m-2 p-2 bg-light">
      <h2>Distribution Providers</h2>
      {buckets.length ? (
        buckets.map((bucket) => <Bucket key={bucket.id} bucket={bucket} />)
      ) : (
        <Loading target="buckets" />
      )}
    </div>
  );
};

export default Distribution;
