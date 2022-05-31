import { useEffect, useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { Player } from "video-react";
import { PlusSquare, MinusSquare } from "react-feather";
import "video-react/dist/video-react.css";
import axios from "axios";

const PlayerModal = (props) => {
  const { id, channel, selectVideo } = props;

  const [latencies, setLatencies] = useState([]);
  const [provider, setProvider] = useState({});
  const [showLatencies, toggleShowLatencies] = useState(false);

  useEffect(() => {
    let latencies = [];
    channel?.distributionBuckets?.forEach((b) => {
      const url = b.operators[0]?.metadata.nodeEndpoint;
      const start = new Date();
      axios
        //        .get(url + "api/v1/status")
        .head(url + `api/v1/assets/${id}`)
        .then(({ data }) => {
          latencies.push({ url, latency: new Date() - start });
          setLatencies(latencies.sort((a, b) => a.latency - b.latency));
          if (latencies[0]) setProvider(latencies[0]);
        })
        .catch((e) => console.error(url, e.message));
    });
  }, [id, channel.distributionBuckets]);

  const video = channel.objects.find((o) => +o.id === +id);
  const { title, description, duration } = video.videoMedia;
  const videoUrl = provider?.url + `api/v1/assets/${id}`;
  const bitrate = video.size / duration / 1024 ** 2;

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={id && channel && video}
      onHide={() => selectVideo()}
    >
      <Modal.Header
        className="no-border overflow-hidden bg-dark text-light"
        closeButton
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          title={`[${id}] ${title}`}
          className="text-nowrap overflow-hidden"
        >
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center bg-dark text-light">
        {latencies.length ? (
          <>
            <Player autoPlay playsInline src={videoUrl}></Player>
            <div className='box float-right'>
              <a className="font-weight-bold" href={`https://play.joystream.org/channel/${channel.id}`}>{channel.title}</a>
              <br/>by <a href={`https://play.joystream.org/member/${channel.owner.handle}?tab=About`}>{channel.owner.handle}</a>
            </div>
            <div className="d-flex flex-column text-left my-2">
              <div>
                Bitrate: {bitrate.toFixed(2)} mps (
                {(video.size / 1024 ** 2).toFixed()} MB / {duration} s)
              </div>
              <div>
                Provider:{" "}
                <Badge>
                  {provider.url} ({provider.latency}ms)
                </Badge>
                <Button
                  variant="dark"
                  className="btn-sm m-1 p-0"
                  onClick={() => toggleShowLatencies(!showLatencies)}
                >
                  {showLatencies ? <MinusSquare /> : <PlusSquare />}
                </Button>
              </div>
            </div>
            {showLatencies ? (
              <div className="d-flex flex-column">
                {latencies.map((l) => (
                  <div
                    key={l.url}
                    className="d-flex flex-row"
                    onClick={() => setProvider(l)}
                  >
                    <Badge>{l.latency} ms</Badge>
                    <Badge>{l.url}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          "Finding best provider .."
        )}
      </Modal.Body>
      <Modal.Footer className="bg-dark text-light d-flex flex-row justify-content-start">
        <div className="d-flex flex-column">
          <div className="font-weight-bold">{title}</div>
          <div>{description}</div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PlayerModal;

const SelectProvider = (props: {
  handleChange: () => void;
  me: { providers: { [key: string]: string[] }; provider: string };
}) => {
  const { handleChange, me } = props;
  const regions = Object.keys(me.providers);
  return (
    <select
      className="form-control text-center bg-dark text-secondary"
      name="provider"
      value={me.provider}
      onChange={handleChange}
    >
      {regions.map((r) =>
        me.providers[r].map((p) => <option key={p}>{p}</option>)
      )}
    </select>
  );
};
