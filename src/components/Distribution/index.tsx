import axios from "axios";
import { useState, useEffect } from "react";
import { Loading } from "..";
import Bucket from "./Bucket";
import TestResults from "./TestResults";
import { getBuckets } from "./util";

const Distribution = (props: {
  workers: { distributionWorkingGroup?: Worker[] };
}) => {
  const { workers } = props;
  const [sBuckets, setSBuckets] = useState([]);
  const [dBuckets, setDBuckets] = useState([]);
  const [results, setResults] = useState([]);
  useEffect(() => {
    const update = () =>
      getBuckets([
        workers?.storageWorkingGroup,
        workers?.distributionWorkingGroup,
      ]).then((buckets) => {
        if (buckets[0].length) setSBuckets(buckets[0]);
        if (buckets[1].length) setDBuckets(buckets[1]);
      });
    update();
    setTimeout(update, 10000);
    axios
      .get(`https://joystreamstats.live/api/v1/bags/errors`)
      .then(({ data }) =>
        setResults(data.sort((a, b) => a.timestamp - b.timestamp))
      );
  }, [workers?.storageWorkingGroup, workers?.distributionWorkingGroup]);
  return (
    <div className="m-2 p-2 bg-light">
      <h2>Storage Buckets</h2>
      {sBuckets.length ? (
        sBuckets.map((bucket) => <Bucket key={bucket.id} bucket={bucket} />)
      ) : (
        <Loading target="storage buckets" />
      )}

      <h2>Distribution Buckets</h2>
      {dBuckets.length ? (
        dBuckets.map((bucket) => (
          <Bucket key={bucket.id} bucket={bucket} isDP={true} />
        ))
      ) : (
        <Loading target="distribution buckets" />
      )}
      <TestResults results={results} />
    </div>
  );
};

export default Distribution;
