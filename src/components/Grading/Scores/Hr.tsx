const Hr = (props: {}) => {
  const { values } = props;
  const total = values[10]
  return <div>HR: {total}</div>;
};

export default Hr