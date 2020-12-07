const Nominators = props => {
  return (
    <div>
      <h3>Nominators</h3>
      <div>
        {props.nominators.map(n => (
          <div>{n}</div>
        ))}
      </div>
    </div>
  );
};

export default Nominators;
