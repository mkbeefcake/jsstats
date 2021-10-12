import { Button } from "react-bootstrap";
import { PlusSquare, MinusSquare } from "react-feather";

const ToggleDetails = (props) => {
  const { toggleDetails, showDetails } = props;
  return (
    <Button
      variant=""
      className="p-0 btn-sm float-left"
      onClick={() => toggleDetails(!showDetails)}
    >
      {showDetails ? (
        <MinusSquare color="white" />
      ) : (
        <PlusSquare color="white" />
      )}
    </Button>
  );
};

export default ToggleDetails;

