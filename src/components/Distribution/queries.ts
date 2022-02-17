export const qnBuckets = `query {
  distributionBuckets{id,createdAt,distributing,acceptingNewBags,bags{id}
    operators {workerId,metadata {extra,nodeEndpoint,nodeLocation {countryCode,coordinates {longitude,latitude}}}}
  } storageBuckets {id,createdAt,acceptingNewBags,bags{id}
    operatorMetadata {extra,nodeEndpoint,nodeLocation {countryCode,coordinates {longitude,latitude}}}
  }}`;

export const qnBucketObjects = (bucketId: string) =>
  `query {  storageBuckets(where: { id_eq: "${bucketId}" }) {id,bags {id,objects {id, size}}}
  distributionBuckets(where: { id_eq: "${bucketId}" }) {id,bags {id,objects {id, size}}} }`;
