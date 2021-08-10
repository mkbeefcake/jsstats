import { Spinner } from "react-bootstrap";

const Spin = () => {
  return (
    <div className="mt-5 d-flex flex-grow-1 text-center justify-content-center">
      <Spinner animation="border" variant="dark" size="sm" />
    </div>
  );
};

export default Spin;
