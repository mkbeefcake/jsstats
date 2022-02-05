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
  useEffect(() => updateStatus(endpoint + `api/v1/status`), [endpoint]);

  if (!status.id) return <div />;
  const { id, objectsInCache, storageLimit, storageUsed, uptime } = status;
  const upSince = moment().subtract(uptime * 1000);
  return (
    <>
      <Badge className="col-1" title="GB used / limit">
        {gb(storageUsed)}/{gb(storageLimit)}
      </Badge>
      <Badge className="col-1" title="Objects (downloading)">
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
