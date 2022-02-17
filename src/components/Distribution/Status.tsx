import { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
const gb = (bytes: number) => (bytes / 1024 ** 3).toFixed();

const Status = (props: { endpoint: string }) => {
  const { endpoint } = props;
  const [status, setStatus] = useState({});
  const updateStatus = (url: string) => {
    console.debug(`udating status`, url);
    axios
      .get(url)
      .then(({ data }) => setStatus(data))
      .catch((e) => console.log(`status`, url, e.message));
  };
  useEffect(() => {
    const route = endpoint.includes("/distributor/") ? "status" : "state/data";
    updateStatus(endpoint + "api/v1/" + route);
  }, [endpoint]);
  if (status.totalSize)
    return (
      <>
        <Badge className="col-1 text-right" title="Storage used in GB">
          {gb(status.totalSize)} gb
        </Badge>
        <Badge className="col-1" title="Files (downloading)">
          {status.objectNumber} files ({status.tempDownloads})
        </Badge>
        <Badge className="col-1" title="temp dir size">
          temp: {gb(status.tempDirSize)} gb
        </Badge>
      </>
    );
  if (!status.id) return <div />;
  const { id, objectsInCache, storageLimit, storageUsed, uptime } = status;
  const upSince = moment().subtract(uptime * 1000);
  return (
    <>
      <Badge className="col-1 text-right" title="GB used / limit">
        {gb(storageUsed)}/{gb(storageLimit)} gb
      </Badge>
      <Badge className="col-1" title="Files (downloading)">
        {objectsInCache} ({status.downloadsInProgress})
      </Badge>
      <Badge className="col-1" title="up since">
        {upSince.fromNow()}
      </Badge>
      {id}
    </>
  );
};

export default Status;
