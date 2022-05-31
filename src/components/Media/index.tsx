import { useEffect } from "react";
import { Badge } from "react-bootstrap";
import axios from "axios";
import { queryNode } from "../../config";

const query = `query {
  storageBags { id
    distributionBuckets { operators { metadata{nodeEndpoint } } }
    objects { id size  
      videoMedia {id categoryId isCensored     isExplicit    isFeatured isPublic
        thumbnailPhotoId duration title description
        mediaMetadata {pixelWidth pixelHeight size encoding {codecName}}
      }
    }
  }
}`;

const Media = (props: {}) => {
  const { save, media } = props;

  useEffect(() => {
    media?.storageBags?.length ||
      axios
        .post(queryNode, { query })
        .then(({ data }) => save("media", data.data))
        .catch((e) => console.error(query, e.message));
  }, [media?.storageBags?.length]);

  return (
    <div className="box">
      <h2>Media</h2>
      {media.storageBags?.length ? (
        <div className="d-flex flex-wrap">
          {media.storageBags
            .reduce((objects, b) => {
              b.objects.map((o) =>
                objects.push({
                  ...o,
                  providers: b.distributionBuckets,
                  bitrate: o.videoMedia?.duration
                    ? (o.size / o.videoMedia.duration).toFixed()
                    : 0,
                })
              );
              return objects;
            }, [])
            .filter((o) => o.bitrate)
            .sort((a, b) => b.bitrate - a.bitrate)
            .map((o) => (
              <Video key={o.id} {...o} />
            ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const Video = (props: {}) => {
  const { id, title, videoMedia, bitrate, providers, size } = props;
  const alt = `${id} ${videoMedia.title}`;
  if (!providers?.length) return "";
  const url = providers[0].operators[0].metadata.nodeEndpoint;
  return (
    <div
      key={videoMedia.id}
      className="text-left m-1"
      style={{ width: "200px" }}
    >
      <img
        className="d-block"
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

export default Media;
