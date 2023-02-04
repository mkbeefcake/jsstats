import { mJoy } from "../../../lib/util";
import Json from "../../Data/Json";

const Group = (props: {}) => {
  const { group, grading, gradingAvailable, gradingUrl } = props;
  if (!group) return <div />;
  const { name, spent, workers } = group;
  console.debug(name, spent, workers);

  return (
    <div className="">
      <div className="mb-2">
        {grading ? (
          <div
            className="d-flex flex flex-row overflow-hidden text-left"
            style={{ maxHeight: "50vh" }}
          >
            <div className="col-4 overflow-auto m-0 p-0">
              <Json src={grading.data} collapsed={1} name={false} />
            </div>
            <div className="col-8 overflow-auto">
              <a
                className="d-block float-right p-2 text-light"
                href={gradingUrl}
                target="_blank"
                rel="noreferrer"
              >
                source
              </a>

              {grading.data.log.slice(1).map((m, i: number) => (
                <div key={i}>{m.message}</div>
              ))}
            </div>
          </div>
        ) : (
          <div className="float-left">
            {gradingAvailable
              ? "Loading grading info .."
              : "No grading data available."}
          </div>
        )}
      </div>

      <h4>Workers</h4>
      <div className="d-flex flex-column text-right">
        <div className="d-flex flex-row">
          <div className="col-5 font-weight-bold text-right">Total</div>
          <div className="col-1">{mJoy(spent)}</div>
        </div>
        {workers
          ? Object.keys(workers)
              .sort((a, b) => workers[b] - workers[a])
              .map((handle) => (
                <div key={`payment-${handle}`} className="d-flex flex-row">
                  <div className="col-5 text-right">{handle}</div>
                  <div className="col-1">{mJoy(workers[handle])}</div>
                </div>
              ))
          : ""}
      </div>
    </div>
  );
};

export default Group;
