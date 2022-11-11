import axios from "axios";
import moment from "moment";
import { queryNode } from "../config";
const unit = "tJoy";

export const fixGroupName = (name = "") =>
  name
    .replace(/(operations)?WorkingGroup/, "")
    .replace(/Alpha/, "builders")
    .replace(/Beta/, "hr")
    .replace(/Gamma/, "marketing");

export const gb = (bytes: number) => (bytes / 1024 ** 3).toFixed() + `gb`;

export const postQN = (query: string, url: string = queryNode) =>
  axios
    .post(url, { query })
    .then(({ data }) => {
      if (data.error) return fail(data.error);
      console.debug(`postQN`, query, data.data);
      return data.data;
    })
    .catch((e) => {
      console.warn(`postQN: query failed: ${e.message}`, query);
      return [];
    });

// JOY

export const mJoy = (tJOY: number = 0, digits = 2) =>
  (tJOY / 1000000).toFixed(digits) +
  ` M ${unit} / $${(tJOY * 0.0015).toFixed()}`;

export const formatJoy = (stake: number): String => {
  if (stake >= 1000000) {
    return `${(stake / 1000000).toFixed(4)} MJOY`;
  }

  if (stake >= 1000) {
    return `${(stake / 1000).toFixed(4)} kJOY`;
  }

  return `${stake} JOY`;
};

// time
export const formatDate = (time?: number) => {
  return moment(time).format("DD/MM/YYYY HH:mm");
};

export const formatTime = (time?: any): string =>
  moment(time).format("H:mm:ss");

export const passedTime = (start: number, now: number): string =>
  formatTime(moment.utc(moment(now).diff(moment(start))));

export const exit = (log: (s: string) => void) => {
  log("\nNo connection, exiting.\n");
  process.exit();
};

// sort

export const sortDesc = (array, key) =>
  array ? array.sort((a, b) => b[key] - a[key]) : [];

// storage

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
