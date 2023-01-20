import Histogram from "../Data/Histogram";

const Videos = (props:{}) => {
  const {selectVideo, objects, page,perPage, showChart} = props 
  return (
    <>
      <Histogram show={showChart} objects={objects} label="videos with bitrate per second" />
      <hr/>
      <div className="d-flex flex-wrap">
        {objects
          .slice((page - 1) * perPage, page * perPage)
          .map((o) => (
            <Video key={o.id} selectVideo={selectVideo} {...o} />
          ))}
      </div>
    </>
  );
};

export default Videos;

const Video = (props: {}) => {
  const { selectVideo, id, videoMedia, bitrate, providers, size } = props;
  if (!providers?.length) return "";
  
  const alt = `${id} ${videoMedia.title}`;  
  const url = providers[0].operators[0]?.metadata.nodeEndpoint ?? null;
  
  return (
    <div
      key={videoMedia.id}
      className="text-left p-1"
      style={{ width: "200px" }}
      onClick={() => selectVideo(id)}
    >
      <img
        className="d-block p-1"
        style={{ width: "200px" }}
        src={url + "api/v1/assets/" + videoMedia.thumbnailPhotoId}
        alt={alt}
        title={alt}
      />
      <div>
        {(bitrate / 1024 ** 2).toFixed(2)} mps / {(size / 1024 ** 2).toFixed()}
        MB / {videoMedia.duration}s
      </div>
    </div>
  );
};
