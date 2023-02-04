const SelectProvider = (props: {
  handleChange: () => void;
  me: { providers: { [key: string]: string[] }; provider: string };
}) => {
  const { handleChange, me } = props;
  const regions = Object.keys(me.providers);
  return (
    <select
      className="form-control text-center bg-dark text-secondary"
      name="provider"
      value={me.provider}
      onChange={handleChange}
    >
      {regions.map((r) =>
        me.providers[r].map((p) => <option key={p}>{p}</option>)
      )}
    </select>
  );
};
export default SelectProvider;
