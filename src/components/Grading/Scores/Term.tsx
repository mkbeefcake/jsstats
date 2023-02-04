import Builders from "./Builders";
import Storage from "./Storage";
import Distribution from "./Distribution";
import Content from "./Content";
import Forum from "./Forum";
import Hr from "./Hr";
import Council from "./Council";
import Marketing from "./Marketing";

const Term = (props: {}) => {
  const { fields, values, term } = props;
  console.debug(term, fields, values);

  return (
    <div className="text-left">
      <h2>{values[0]}</h2>
      <div>
        Dates: {values[1]} {values[2]} {values[3]}
      </div>
      <div>Start: #{values[4]}</div>
      <div>End: #{values[5]}</div>
      <div>Network Score: {values[4]}</div>
      <Builders values={values} />
      <Content values={values} />
      <Storage values={values} />
      <Distribution values={values} />
      <Forum values={values} />
      <Hr values={values} />
      <Council values={values} />
      <Marketing values={values} />
    </div>
  );
};

export default Term;
