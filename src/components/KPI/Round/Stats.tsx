import moment from "moment";
const Stats = (props: { round }) => {
  const {
    electionRound,
    councilMembers,
    fiatDiff,
    reward,
    startBlock,
    startDate,
    endBlock,
    endDate,
    deadline,
    deadlineBlock,
  } = props.round;
  const length = moment(endDate, "DD.MM.YY").diff(
    moment(startDate, "DD.MM.YY"),
    "days"
  );

  return (
    <div>
      <ul>
        <li>
          <b>Total Possible Rewards:</b> ${reward}
        </li>
        <li>
          <b>Max Fiat Pool Difference:</b> ${fiatDiff}
        </li>
        <li>
          <b>Council Elected in Round:</b> {electionRound}
        </li>
        <li>
          <b>Council Members:</b> {councilMembers}
        </li>
        <li>
          <b>KPI Length:</b> ${endBlock - startBlock} ({length} days)
          <ul>
            <li>
              <b>Start Block/Date:</b> #{startBlock} ({startDate})
            </li>
            <li>
              <b>End Block/Date:</b> #{endBlock} ({endDate})
            </li>
          </ul>
        </li>
        <li>
          <b>Deadline to Submit Summary:</b> {deadlineBlock} ({deadline})
        </li>
      </ul>
    </div>
  );
};

export default Stats;
