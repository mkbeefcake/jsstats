
const Builders = (props: {}) => {
  const { values } = props;
  const total = values[5]
  return <div>Builders: {total}</div>;
};

export default Builders