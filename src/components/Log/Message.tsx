import moment from "moment";

const Message = (props: {}) => {
  const { level, time, msg, data } = props;
  const color =
    level === "e"
      ? "bg-danger"
      : level === "w"
      ? "bg-warning"
      : level === "i"
      ? "bg-light"
      : "bg-light";

  return (
    <div className={`d-flex flex-row ` + color}>
      <div className="px-2">{moment(time).format("YYYY-MM-DD HH:mm:ss")}</div>
      <div className="col-6">{msg}</div>
      <div>{data}</div>
    </div>
  );
};

export default Message;
