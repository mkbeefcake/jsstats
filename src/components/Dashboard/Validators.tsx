const Validators = (props: { validators: string[] }) => {
  return (
    <div>
      <h3>Validators</h3>
      <div>
        {props.validators.map((v: string) => (
          <div>{v}</div>
        ))}
      </div>
    </div>
  );
};

export default Validators;
