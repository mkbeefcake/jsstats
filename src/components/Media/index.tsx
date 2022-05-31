import axios from "axios";
import { useEffect, useState } from "react";
import { PlusSquare, MinusSquare } from "react-feather";
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
  const { save, selectVideo, media } = props;
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  useEffect(() => {
    media?.storageBags?.length ||
      axios
        .post(queryNode, { query })
        .then(({ data }) => save("media", data.data))
        .catch((e) => console.error(query, e.message));
  }, [save, media?.storageBags?.length]);

  return (
    <div className="box">
      <h2>
        <MinusSquare onClick={() => page > 1 && setPage(page - 1)}>
          -
        </MinusSquare>{" "}
        Media
        <PlusSquare className="ml-1" onClick={() => setPage(page + 1)}>
          +
        </PlusSquare>
      </h2>
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
            .slice((page - 1) * perPage, page * perPage)
            .map((o) => (
              <Video key={o.id} selectVideo={selectVideo} {...o} />
            ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const Video = (props: {}) => {
  const { selectVideo, id, videoMedia, bitrate, providers, size } = props;
  const alt = `${id} ${videoMedia.title}`;
  if (!providers?.length) return "";
  const url = providers[0].operators[0].metadata.nodeEndpoint;
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

export default Media;
