import { maxEras } from "./config";

const Eras = (props: {
  eras: { [key: number]: number };
  validator: string;
}) => {
  const { eras, validator } = props;
  if (!eras) return <div />;
  return Object.keys(eras)
    .sort((a, b) => b - a)
    .slice(0, maxEras)
    .map((era) => (
      <div
        key={era}
        className="d-none d-md-inline col-2 col-lg-1 text-right"
        title={`Era ${era}: ${validator}`}
      >
        {eras[era]}
      </div>
    ));
};

export default Eras;
