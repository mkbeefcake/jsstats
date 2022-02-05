import { Button } from "react-bootstrap";

const StatusBadge = (props: {
  label: string;
  title: string;
  status: boolean;
}) => {
  const { label, title, status } = props;
  const variant = status ? `success` : `danger`;
  return (
    <Button variant={variant} className="p-1 m-1" title={title}>
      {label}
    </Button>
  );
};

export default StatusBadge;
