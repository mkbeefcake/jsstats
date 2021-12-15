import axios from "axios";
import { hydraLocation } from "../config";

export const getAssets = async () => {
  const query = {
    query: `\nquery {
  videos (limit:1000000, orderBy:createdAt_DESC){
    id
    title
    updatedAt
    createdAt
    createdInBlock
    mediaDataObject {
      joystreamContentId
      liaisonJudgement
      ipfsContentId
      liaison {
        workerId
        metadata
        isActive
      }
    }
  }
}\n`,
  };
  console.debug(`Fetching data IDs from ${hydraLocation}`);
  return axios.post(hydraLocation, query).then(({ data }) => data.data.videos);
};

export const getStorageProviders = async () => {
  const request = {
    query:
      'query {\n  workers(where: {metadata_contains: "http", isActive_eq: true, type_eq: STORAGE}){\n    metadata\n  }\n}',
  };
  console.debug(`Fetching storage providers from ${hydraLocation}`);
  return axios.post(hydraLocation, request).then(({ data }) =>
    data.data.workers.map((p) => {
      return { url: p.metadata };
    })
  );
};

export const getStorageProvidersFromApi = async (api: Api) => {
  console.debug(`Fetching storage providers (from chain)`);
  let providers = [];
  const worker = await api.query.storageWorkingGroup.nextWorkerId();
  console.log(`next provider: ${worker}`);

  for (let i = 0; i < Number(worker); ++i) {
    let storageProvider = (await api.query.storageWorkingGroup.workerById(
      i
    )) as WorkerOf;
    if (storageProvider.is_active) {
      const storage = (await api.query.storageWorkingGroup.workerStorage(
        i
      )) as Bytes;
      const url = Buffer.from(storage.toString().substr(2), "hex").toString();

      let membership = (await api.query.members.membershipById(
        storageProvider.member_id
      )) as Membership;

      providers[i] = {
        owner: membership.handle,
        account: membership.root_account,
        storage,
        url,
      };
    }
    return providers;
  }
};
