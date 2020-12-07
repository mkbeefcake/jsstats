const Validators = props => {
  return (
    <div>
      <h3>Validators</h3>
      <div>
        {props.validators.map(v => (
          <div>{v}</div>
        ))}
      </div>
    </div>
  );
};

export default Validators;
