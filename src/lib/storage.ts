import axios from "axios";

export const getAssets = async () => {
  const url = "https://hydra.joystream.org/graphql";
  const request = {
    query: "query {\n dataObjects(where: {}) { joystreamContentId }\n}",
  };
  console.debug(`Fetching data IDs from ${url}`);
  const { data } = await axios.post(url, request);
  let assets = [];
  data.data.dataObjects.forEach((p) => assets.push(p.joystreamContentId));
  return data;
};

export const getStorageProviders = async () => {
  const url = "https://hydra.joystream.org/graphql";
  const request = {
    query:
      'query {\n  workers(where: {metadata_contains: "http", isActive_eq: true, type_eq: STORAGE}){\n    metadata\n  }\n}',
  };
  console.debug(`Fetching storage providers from ${url}`);
  const { data } = await axios.post(url, request);
  const providers = data.data.workers.map((p) => {
    return {
      url: p.metadata,
    };
  });
  return providers;
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
