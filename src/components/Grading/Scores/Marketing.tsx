const Marketing = (props: {}) => {
  const { values } = props;
  const total = values[15]
  return <div>Marketing: {total}</div>;
};

export default Marketing