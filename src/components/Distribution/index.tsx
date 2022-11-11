import axios from "axios";
import { useState, useEffect } from "react";
import { Loading } from "..";
import Bucket from "./Bucket";
//import Map from "./Map";
import TestResults from "./TestResults";
import { getBuckets } from "./util";

const uploadErrorsUrl = "https://joystreamstats.live/static/upload-errors.json";

const Distribution = (props: {
  buckets: any[][];
  workers: { distributionWorkingGroup?: Worker[] };
}) => {
  const { save, buckets = [], workers } = props;
  const [sBuckets, setSBuckets] = useState(buckets[0] ? buckets[0] : []);
  const [dBuckets, setDBuckets] = useState(buckets[1] ? buckets[1] : []);
  const [providers, setProviders] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  const fetchErrors = () =>
    axios
      .get(uploadErrorsUrl)
      .then(({ data }) => setUploadErrors(data.slice(0, 25)))
      .catch((e) => console.error(e.message, uploadErrorsUrl));

  const updateBuckets = () =>
    getBuckets([
      workers?.storageWorkingGroup,
      workers?.distributionWorkingGroup,
    ]).then((buckets) => {
      save("buckets", buckets);
      if (buckets[0].length) setSBuckets(buckets[0]);
      if (buckets[1].length) setDBuckets(buckets[1]);
    });

  const processResults = (results) => {
    let providers = [];
    results.forEach((r) => {
      if (!providers[r.endpoint]) providers[r.endpoint] = [];
      providers[r.endpoint].push(r);
    });
    setProviders(providers);
  };

  const getFailingAssets = () =>
    axios
      .get(`https://joystreamstats.live/api/v1/bags/errors`)
      .then(({ data }) =>
        processResults(data.sort((a, b) => a.timestamp - b.timestamp))
      );
  useEffect(() => {
    updateBuckets();
    fetchErrors();
    getFailingAssets();
    setTimeout(updateBuckets, 300000);
  });

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
      <TestResults uploadErrors={uploadErrors} providers={providers} />
    </div>
  );
};

export default Distribution;
