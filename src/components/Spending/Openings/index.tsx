const Openings = (props: {}) => {
  return (
    <div className="d-flex flex-wrap">
      <div className="col-6">
        <div>
          {sortDesc(openingAdded, "inBlock").map((e, i) => (
            <div key={i} className="d-flex flex-row">
              <div className="col-1">{e.inBlock}</div>
              <div className="col-1">{fixGroupName(e.groupId)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-6">
        <div>
          {sortDesc(openingCanceled, "inBlock").map((e, i) => (
            <div key={i} className="d-flex flex-row">
              <div className="col-1">{e.inBlock}</div>
              <div className="col-1">{fixGroupName(e.groupId)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Openings;
