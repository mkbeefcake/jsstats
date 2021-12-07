import Details from "./Details";
import InfoTooltip from "../Tooltip";

const Applications = (props: { applications: Application[] }) => {
  const { applications } = props;
  if (!applications.length) return <span>No applications</span>;
  const count = applications.length;
  return (
    <>
      <span>
        {count} application{count !== 1 ? "s" : ""}:
      </span>
      {applications.map((a) => (
        <InfoTooltip
          key={a.id}
          placement="bottom"
          title={
            <Details object={JSON.parse(a.application.human_readable_text)} />
          }
        >
          <span className="ml-1">{a.member.handle || a.memberId}</span>
        </InfoTooltip>
      ))}
    </>
  );
};

export default Applications;
