import moment from "moment";
import Provider from "./ProviderLatency";

const Results = (props: { providers: any[]; uploadErrors: any[] }) => {
  const { uploadErrors, providers } = props;
  return <></>
  return (
    <div className="mt-2">
      <h2>Upload errors</h2>
      <div
        key={`upload-errors-head`}
        className="font-weight-bold bg-info d-flex flex-row"
      >
        <div className="col-2">Date</div>
        <div className="col-4">Endpoint</div>
        <div className="col-4">Error</div>
        <div className="col-1">Channel</div>
        <div className="col-1">Video</div>
      </div>

      {uploadErrors.length
        ? uploadErrors.map((e, i) => (
            <div key={`upload-error-${i}`} className="d-flex flex-row">
              <div className="col-2">
                {moment(e.date).format(`MMM DD HH:mm`)}
              </div>
              <div className="col-4">{e.uploadOperatorEndpoint}</div>
              <div className="col-4">{e.errorMessage}</div>
              <div className="col-1">{e.channelId}</div>
              <div className="col-1">{e.dataObjectId}</div>
            </div>
          ))
        : ""}

      <h2>Failing Objects</h2>
      <div className="d-flex flex-column">
        {Object.keys(providers)
          .sort((a, b) => providers[b].length - providers[a].length)
          .map((url) => (
            <Provider key={url} url={url} results={providers[url]} />
          ))}
      </div>
    </div>
  );
};

export default Results;
