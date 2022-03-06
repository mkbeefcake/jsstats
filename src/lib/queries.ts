import { apiLocation } from "../config";
import { Tokenomics } from "../types";
import axios from "axios";

export const queryJstats = (route: string) => {
  const url = `${apiLocation}/${route}`;
  return axios.get(url).then(({ data }) => {
    if (data && !data.error) return data;
    return console.error(`Jstats query failed: ${route}`, data);
  });
};

export const getTokenomics = async (old?: Tokenomics) => {
  if (old?.timestamp + 300000 > new Date()) return;
  console.debug(`Updating tokenomics`);
  let { data } = await axios.get("https://status.joystream.org/status");
  if (!data || data.error) return;
  data.timestamp = new Date();
  return data;
};

export const getFAQ = async () => {
  const { data } = await axios.get(
    `https://joystreamstats.live/static/faq.json`
  );
  if (!data || data.error) return console.error(`failed to fetch from API`);
  return data;
};

// Reports
export const getReports = async () => {
  const domain = `https://raw.githubusercontent.com/Joystream/community-repo/master/council-reports`;
  const apiBase = `https://api.github.com/repos/joystream/community-repo/contents/council-reports`;

  const urls: { [key: string]: string } = {
    alexandria: `${apiBase}/alexandria-testnet`,
    archive: `${apiBase}/archived-reports`,
    template: `${domain}/templates/council_report_template_v1.md`,
  };

  ["alexandria", "archive"].map((folder) => getGithubDir(urls[folder]));

  // template
  getGithubFile(urls.template);
};

const getGithubFile = async (url: string): Promise<string> => {
  const { data } = await axios.get(url);
  return data;
};

const getGithubDir = async (url: string) => {
  const { data } = await axios.get(url);

  data.forEach(
    async (o: {
      name: string;
      type: string;
      url: string;
      download_url: string;
    }) => {
      const match = o.name.match(/^(.+)\.md$/);
      const name = match ? match[1] : o.name;
      if (o.type === "file")
        this.saveReport(name, this.fetchGithubFile(o.download_url));
      else this.fetchGithubDir(o.url);
    }
  );
};

export const bootstrap = (save: (key: string, data: any) => {}) => {
  [
    { tokenomics: () => getTokenomics() },
    //{ faq: () => getFAQ() },
    //{ reports: () => getReports() },
    { members: () => queryJstats(`/v2/members`) },
    { proposals: () => queryJstats(`/v1/proposals`) },
    { posts: () => queryJstats(`/v1/posts`) },
    { threads: () => queryJstats(`/v1/threads`) },
    { categories: () => queryJstats(`/v1/categories`) },
    //{ providers: () => getStorageProviders() },
    //{ assets: () => getAssets() },
  ].reduce(async (promise, request) => {
    //promise.then(async () => {
    const key = Object.keys(request)[0];
    console.debug(`Requesting ${key}`);
    return save(key, await request[key]());
    //}, new Promise((res) => res))
  });
};
