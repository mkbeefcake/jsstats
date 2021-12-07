const Validator = (props: {
  validator: string;
  member: { handle: string };
}) => {
  const { member, validator } = props;
  const short = (key: string) =>
    key.slice(0, 6) + `..` + key.slice(key.length - 6);
  return (
    <a
      href={`/validators#${validator}`}
      className="col-6 col-md-3 col-lg-2 text-right"
    >
      {member ? member.handle : short(validator)}
    </a>
  );
};

export default Validator;
