export interface Operator {
  workerId?: number;
  metadata?: {
    extra: string;
    nodeEndpoint: string;
  };
}

export interface Family {
  id: string;
  buckets: { id: string; bags: { id: string } }[];
  metadata: { description: string; region: string };
}

export interface Bucket {
  id: string;
  createdAt: string;
  distributing: boolean;
  acceptingNewBags: boolean;
  operators: Operator[];
  bags: Bag[];
}

export interface Bag {
  id: number;
  objects: Object[];
}

export interface Object {
  id: nubmer;
  size: number;
}

interface StatusData {
  id: string;
  objectsInCache: number;
  storageLimite: number;
  storageUsed: number;
  uptime: number;
  downloadsInProgress: number;
}
