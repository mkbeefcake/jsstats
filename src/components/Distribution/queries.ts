export const qnDistributionBuckets = `query distributionBuckets { distributionBuckets{id,createdAt,distributing,acceptingNewBags,operators {workerId,metadata {extra,nodeEndpoint}} bags{id}}}`;

export const qnBucketObjects = (bucketId: string) =>
  `query { distributionBuckets(where: { id_eq: "${bucketId}" }) {id,bags {id,objects {id, size}}}}`;
