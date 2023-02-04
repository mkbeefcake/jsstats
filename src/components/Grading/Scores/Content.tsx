const Content = (props: {}) => {
  const { values } = props;
  const total = values[6]
  return <div>Content: {total}</div>;
};

export default Content