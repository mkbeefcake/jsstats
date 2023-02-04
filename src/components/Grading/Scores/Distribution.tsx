const Distribution = (props: {}) => {
  const { values } = props;
  const total = values[8]
  return <div>Distribution: {total}</div>;
};

export default Distribution