const Storage = (props: {}) => {
  const { values } = props;
  const total = values[7]
  return <div>Storage: {total}</div>;
};

export default Storage