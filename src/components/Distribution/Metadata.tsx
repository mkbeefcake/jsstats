import Status from "./Status";

const Metadata = (props: { metadata }) => {
  if (!props.metadata) return <div />;
  const { nodeEndpoint, nodeLocation } = props.metadata;
  const { countryCode, coordinates } = nodeLocation;
  return (
    <>
      <div className="col-1">
        {countryCode} ({coordinates.latitude.toFixed()},
        {coordinates.longitude.toFixed()})
      </div>
      <Status endpoint={nodeEndpoint} />
    </>
  );
};

export default Metadata;
