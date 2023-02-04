const Forum = (props: {}) => {
  const { values } = props;
  const total = values[9]
  return <div>Forum: {total}</div>;
};

export default Forum