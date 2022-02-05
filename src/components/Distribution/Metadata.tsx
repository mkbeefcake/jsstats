import Status from "./Status";

const Metadata = (props: { metadata }) => {
  if (!props.metadata) return <div />;
  const { nodeEndpoint } = props.metadata;

  return <Status endpoint={nodeEndpoint} />;
};

export default Metadata;
