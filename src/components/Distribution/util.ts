import axios from "axios";
import { Operator, Bucket } from "./types";
import { qnBuckets, qnBucketObjects } from "./queries";
import { Family } from "./types";
import { postQN } from "../../lib/util";

export const testQN = (
  op: Operator,
  setStatus: (b: boolean) => void,
  setInfo: (s: string) => void,
  setUrl: (s: string) => void,
  setFamilies: (f: Family[]) => void
): Promise<void> => {
  const query = `query { distributionBucketFamilies {id,metadata{description,region} buckets{id}}}`;
  const qnUrl = op?.metadata?.nodeEndpoint?.replace(/[^/]+\/?$/, `graphql`);
  setUrl(qnUrl || ``);
  if (!qnUrl) return;
  setTimeout(() => {
    console.debug(`testing QN`, qnUrl);
    try {
      axios.post(qnUrl, { query }).then(({ data }) => {
        if (!data.data || data.errors)
          return setInfo(JSON.stringify(data.errors));
        setStatus(true);
        setInfo(JSON.stringify(data.data));
        if (data.data.distributionBucketFamilies?.length)
          setFamilies(data.data.distributionBucketFamilies);
      }); // TODO extra test to verify data
      //.catch((e) => setInfo(e.message + JSON.stringify(e)));
    } catch (e) {
      setInfo(e.message + JSON.stringify(e));
      console.debug(qnUrl, e.message);
    }
  }, 1000);
};

export const getBucketObjects = async (bucketId: number) =>
  postQN(qnBucketObjects(bucketId)).then(
    ({ storageBuckets, distributionBuckets }) => {
      const bags = storageBuckets.length
        ? storageBuckets[0].bags
        : distributionBuckets[0].bags;
      console.debug(`received objects of bucket`, bucketId, bags);
      return bags;
    }
  );

export const getBuckets = async (workers: Worker[][]): Promise<Bucket[]> =>
  postQN(qnBuckets).then(({ distributionBuckets, storageBuckets }) => {
    if (!storageBuckets || !distributionBuckets) return [[], []];
    const storage =
      storageBuckets &&
      sortBuckets(
        storageBuckets.map((b) => addWorkerMemberships(b, workers[0]))
      );
    const distribution =
      distributionBuckets &&
      sortBuckets(
        distributionBuckets.map((b) => addWorkerMemberships(b, workers[1]))
      );
    return [storage, distribution];
  });

// TODO OPTIMIZE sort by bucketIndex
const sortBuckets = (buckets: Bucket[]): Bucket[] =>
  buckets.sort((a, b) => a.id.split(":")[0] - b.id.split(":")[0]);

export const addWorkerMemberships = (
  bucket: Bucket,
  workers?: Worker[]
): Bucket => {
  let operators = [];
  if (bucket.operators)
    operators = bucket.operators.map((operator) => {
      const member = workers?.find((w) => w.id === operator.workerId);
      return { ...operator, member };
    });
  return { ...bucket, operators };
};
