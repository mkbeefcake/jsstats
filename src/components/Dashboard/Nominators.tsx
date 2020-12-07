const Nominators = (props: { nominators: string[] }) => {
  return (
    <div>
      <h3>Nominators</h3>
      <div>
        {props.nominators.map((n: string) => (
          <div>{n}</div>
        ))}
      </div>
    </div>
  );
};

export default Nominators;
