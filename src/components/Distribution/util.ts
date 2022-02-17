import axios from "axios";
import { queryNode } from "../../config";
import { Bucket } from "./types";
import { qnBuckets, qnBucketObjects } from "./queries";

export const gb = (bytes: number) => (bytes / 1024 ** 3).toFixed() + `gb`;

const fail = (msg: string) => {
  console.log(`postQN: ${msg}`);
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
): Promise<[string]> => {
  if (!endpoint) return `no endpoint given`;
  if (!objects) return `warning`;
  if (!objects.length) return ``;
  const object = Math.round(Math.random() * (objects.length - 1));
  const route = endpoint.includes(`storage`) ? `files` : `assets`;
  const url = endpoint + `api/v1/${route}/${objects[object].id}`;
  return axios
    .head(url)
    .then((data) => `success`)
    .catch((e) => {
      console.error(`testBag ${url}: ${e.message}`);
      return `danger`;
    });
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
