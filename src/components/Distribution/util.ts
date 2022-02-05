import axios from "axios";
import { queryNode } from "../../config";
import { Bucket } from "./types";
import { qnDistributionBuckets, qnBucketObjects } from "./queries";

export const gb = (bytes: number) => (bytes / 1024 ** 3).toFixed() + `gb`;

const fail = (msg: string) => {
  console.log(`getQN: ${string}`);
  return [];
};
export const postQN = (query) =>
  axios
    .post(queryNode, { query })
    .then(({ data }) => {
      if (data.error) return fail(data.error);
      console.debug(`postQN`, query, data.data);
      return data.data;
    })
    .catch((e) => fail(e.message));

export const testBag = async (
  endpoint: string,
  objects: Object[] | null
): Promise<string> => {
  if (!objects) return `warning`;
  if (!objects.length) return ``;
  return axios
    .head(endpoint + `api/v1/assets/${objects[0].id}`)
    .then((data) => `success`)
    .catch((e) => {
      console.error(`testBag: ${e.message}`);
      return `danger`;
    });
};

export const getBucketObjects = async (bucketId: number) =>
  postQN(qnBucketObjects(bucketId)).then(({ distributionBuckets }) => {
    if (!distributionBuckets) {
      console.error(`getBucketObjects: received empty distributionBuckets`);
      return [];
    }
    const bags = distributionBuckets[0].bags;
    console.debug(`received objects of bucket`, bucketId, bags);
    return bags;
  });

export const getDistributionBuckets = async (
  workers?: Worker[]
): Promise<Bucket[]> =>
  postQN(qnDistributionBuckets).then(({ distributionBuckets }) =>
    sortBuckets(
      distributionBuckets.map((b) => addWorkerMemberships(b, workers))
    )
  );

// TODO OPTIMIZE sort by bucketIndex
const sortBuckets = (buckets: Bucket[]): Bucket[] =>
  buckets.sort((a, b) => a.id.split(":")[0] - b.id.split(":")[0]);

export const addWorkerMemberships = (
  bucket: Bucket,
  workers?: Worker[]
): Bucket => {
  const operators = bucket.operators.map((operator) => {
    const member = workers?.find((w) => w.id === operator.workerId);
    return { ...operator, member };
  });
  return { ...bucket, operators };
};
