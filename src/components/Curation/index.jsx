import React from "react";
import { Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-feather";
import Buttons from "./Buttons";
import ToggleCurated from "./ToggleCurated";
import Curated from "./Curated";
import Loading from "../Loading";
import moment from "moment";
import axios from "axios";

import { Player } from "video-react";
import "video-react/dist/video-react.css";

import { domain } from "../../config";
import { fetchPending } from "../../lib/hydra";

class Curation extends React.Component<> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      page: 1,
      pending: [],
      hideWithoutThumb: true,
      ipfsLocations: {},
    };
    this.setPage = this.setPage.bind(this);
    this.findProvider = this.findProvider.bind(this);
    this.toggleHideWithoutThumb = this.toggleHideWithoutThumb.bind(this);
  }

  componentDidMount() {
    this.fetchPending();
  }

  async fetchPending(offset: number = 0) {
    const { page } = this.state;
    console.log(`Fetching assets (offset: ${offset})`);
    const pending = await fetchPending(offset);
    this.setState({ pending, loading: false });
  }

  async findProvider(hash) {
    console.debug(`looking for provider for ${hash}`);
    const { providers } = this.props;

    providers.forEach(async ({ url }) => {
      try {
        const request = `${url}asset/v0/${hash}`;
        console.debug(`testing ${request}`);
        const { status, data } = await axios.head(request);
        if (!status === 200) return;
        console.log(`found: `, request, status, data);

        let { ipfsLocations } = this.state;
        ipfsLocations[hash] = request;
        this.setState({ ipfsLocations });
      } catch (e) {
        //console.log(e);
      }
    });
  }

  setPage(page: number) {
    this.setState({ page, loading: true, pending: [] });
    this.fetchPending((page - 1) * 50);
  }
  toggleHideWithoutThumb() {
    this.setState({ hideWithoutThumb: !this.state.hideWithoutThumb });
  }

  render() {
    const {
      toggleShowCurated,
      handleChange,
      addVideoVote,
      selectVideo,
      videos = [],
      curations = [],
      search,
      providers,
    } = this.props;
    const {
      loading,
      pending,
      page,
      hideWithoutThumb,
      ipfsLocations,
    } = this.state;
    if (!pending) return <Loading target="pending videos" />;

    const showCurated = this.props.showCurated ? "" : "un";
    const noThumb = pending.filter((v) => !v.thumbnailPhotoDataObject);

    return (
      <div className="h-100 bg-warning m-1 overflow-auto">
        <div className="d-flex flex-row">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => this.setPage(page - 1)}
          >
            <ChevronLeft />
          </Button>

          <input
            className="flex-fill p-1"
            name="search"
            value={search}
            placeholder={
              loading
                ? `Loading page ${page} ..`
                : `Search in ${pending.length} uploads`
            }
            disabled={!pending.length}
            onChange={handleChange}
          />
          {curations.length ? (
            <ToggleCurated
              curations={curations.length}
              toggle={toggleShowCurated}
            />
          ) : null}
          <Button variant="secondary" onClick={() => this.setPage(page + 1)}>
            <ChevronRight />
          </Button>
        </div>

        <div className="p-3">
          {noThumb.length ? (
            <div
              className="text-right mb-1"
              title={noThumb.map((v) => v.id).join(" ")}
              onClick={this.toggleHideWithoutThumb}
            >
              No thumbnail: {noThumb.length}
            </div>
          ) : (
            ``
          )}

          {pending
            .filter((v) => hideWithoutThumb || v.thumbnailPhotoDataObject)
            .map((v: Video) => {
              const {
                id,
                ipfsContentId,
                mediaDataObject,
                createdAt,
                createdInBlock,
                updatedAt,
                size,
              } = v;
              const ipfs = v.mediaDataObject.joystreamContentId;
              const {
                categoryId,
                channelId,
                title,
                description,
                duration,
                languageId,
                licenseId,
                hasMarketing,
                isCensored,
                isExplicit,
                isFeatured,
                mediaDataObjectId,
                mediaMetadataId,
                mediaUrls,
                thumbnailPhotoDataObjectId,
              } = hideWithoutThumb
                ? v.mediaDataObject
                  ? v.mediaDataObject
                  : {}
                : v.thumbnailPhotoDataObject;

              return (
                <div key={id}>
                  <h4>
                    <a href={`https://play.joystream.org/video/${id}`}>
                      {title || `Video ${id}`}
                    </a>
                  </h4>

                  <div className="d-flex flex-row mb-3">
                    <div className="col-3">
                      <div>
                        <div>
                          created: {moment(createdAt).fromNow()} (
                          <a
                            href={`${domain}/#/explorer/query/${createdInBlock}`}
                          >
                            {createdInBlock}
                          </a>
                          )
                        </div>
                        <div>updated: {moment(updatedAt).fromNow()}</div>
                        <div>
                          Duration:{" "}
                          {duration > 60
                            ? `${(duration / 60).toFixed()} m, ${
                                duration % 60
                              } s`
                            : `${duration || 0} s`}
                        </div>
                        <div>Size: {(size / 1000000).toFixed(1)} mb</div>
                        <div>
                          Channel:{" "}
                          <a
                            href={`https://play.joystream.org/video/${channelId}`}
                          >
                            {channelId}
                          </a>
                        </div>
                        <div>License: {licenseId}</div>
                        <div>Language: {languageId}</div>
                      </div>

                      {ipfsLocations[ipfs] ? (
                        ``
                      ) : (
                        <div>
                          <div
                            className="px-3 display-none"
                            style={{ width: "130px", minWidth: "130px" }}
                          >
                            <img
                              onClick={() => selectVideo(id)}
                              src={thumbnailPhotoDataObjectId}
                              alt={thumbnailPhotoDataObjectId}
                              width="100"
                            />
                          </div>
                          <Button
                            onClick={() => this.findProvider(ipfs)}
                            variant="light"
                            className="btn btn-sm"
                          >
                            Load
                          </Button>
                        </div>
                      )}
                    </div>
                    {ipfsLocations[ipfs] ? (
                      <div className="col-5">
                        <Player
                          autoPlay
                          playsInline
                          src={ipfsLocations[ipfs]}
                        />
                      </div>
                    ) : (
                      ``
                    )}

                    <div className={ipfsLocations[ipfs] ? "col-4" : "col-9"}>
                      <Buttons addVideoVote={addVideoVote} id={id} />
                      <span onClick={() => selectVideo(id)}>
                        <Curated curations={curations} videoId={id} />
                      </span>
                      <p>{description}</p>
                      <div title={JSON.stringify(v)}>Details</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default Curation;
