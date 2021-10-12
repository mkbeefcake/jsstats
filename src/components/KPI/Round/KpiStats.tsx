//import ToggleDetails from "./ToggleDetails"

const KpiStats = (props) => {
  const { kpi, showDetails, toggleDetails, start, end } = props;
  const { id, title, reward, fiatPool, distribution, process, active } = kpi;

  return (
    <div
      id={id}
      className={`py-3 col-12 col-md-6 ${showDetails ? "bg-dark" : ""}`}
      title={showDetails ? `click to expand` : `click to fold`}
      onClick={() => toggleDetails(!showDetails)}
    >
      <b>{title}</b>

      <ul>
        <li>
          <b>ID:</b> {id}
        </li>
        <li>
          <b>Reward:</b> {reward}
        </li>
        <li>
          <b>Fiat Pool Factor:</b> {fiatPool}
        </li>
        <li>
          <b>Reward Distribution:</b> {distribution}
        </li>
        <li>
          <b>Grading Process:</b> {process}
        </li>
        <li>
          <b>Active:</b> {active}
          <ul>
            <li>
              <b>Start Block:</b> {start}
            </li>
            <li>
              <b>End Block:</b> {end}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default KpiStats;

