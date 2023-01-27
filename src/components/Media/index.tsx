import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart2, PlusSquare, MinusSquare } from "react-feather";
import { queryNode } from "../../config";
import Videos from "./Videos";

const query = `query {
  channels (limit: 10000) { id title ownerMemberId }
  memberships(limit: 10000) { id handle channels {id} ownedNfts {id} }
  storageBags { id 
    distributionBuckets { operators { metadata{nodeEndpoint } } }
    objects { id size  
      videoMedia {id categoryId isCensored isExplicit isPublic
      thumbnailPhotoId duration title description
      mediaMetadata {pixelWidth pixelHeight size encoding {codecName} } }               
    }  }
}`;

const Media = (props: {}) => {
  const { save, selectVideo, media } = props;
  const [page, setPage] = useState(1);
  const [perPage] = useState(50);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    media?.channels ||
      axios
        .post(queryNode, { query })
        .then(({ data }) => save("media", data.data))
        .catch((e) => console.error(query, e.message));
  }, [save, media?.storageBags?.length, media?.channels]);

  return (
    <div className="box">
      <h2>
        <BarChart2
          className="float-right"
          onClick={() => setShowChart(!showChart)}
        />
        <MinusSquare
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
        />
        Media
        <PlusSquare className="ml-1" onClick={() => setPage(page + 1)} />
      </h2>
      {media.storageBags?.length ? (
        <Videos
          showChart={showChart}
          selectVideo={selectVideo}
          perPage={perPage}
          page={page}
          objects={media.storageBags
            .reduce((objects, b) => {
              b.objects.forEach((o) => {
                if (!o.videoMedia?.duration) return; //console.debug(`skipping`,o)
                const bitrate = (o.size / o.videoMedia.duration).toFixed();
                const obj = { ...o, providers: b.distributionBuckets, bitrate };
                objects.push(obj);
              });
              return objects;
            }, [])
            .filter((o) => o.bitrate)
            .sort((a, b) => b.bitrate - a.bitrate)}
        />
      ) : (
        "Waiting for QN results .."
      )}
    </div>
  );
};

export default Media;
