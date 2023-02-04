import { List } from "react-feather";
import Message from "./Message";
//import Filters from './Filters'

const Icon = (props: {}) => {
  const { toggleShow } = props;
  return (
    <List
      className="p-1 bg-dark"
      color="white"
      strokeWidth="1"
      onClick={toggleShow}
    />
  );
};

const Log = (props: {}) => {
  const { log, settings, save } = props;
  const f = settings.logFilter || { d: true };
  const msgs = log.filter((m) => !f[m.level]).sort((a, b) => b.time - a.time);

  const toggleShow = () => {
    settings.showLog = !settings.showLog;
    save("settings", settings);
  };
  const toggleLvl = (lvl) => {
    f[lvl] = !f[lvl];
    settings.logFilter = f;
    save("settings", settings);
  };

  if (!settings.showLog)
    return (
      <div style={{ position: "fixed ", bottom: "0", left: "0" }} title="Log">
        <Icon toggleShow={toggleShow} />
      </div>
    );

  return (
    <div
      className="m-1 w-100 d-flex flex-column overflow-auto bg-light"
      style={{ maxHeight: "10vh", minHeight: "20vh" }}
    >
      <div className="w-100 position-fixed d-flex flex-row bg-light">
        <Icon toggleShow={toggleShow} />
        <Filters f={f} toggleLvl={toggleLvl} />{" "}
      </div>
      <div className="mt-4">
        {msgs.length ? (
          msgs.map((m) => <Message key={m.time} {...m} />)
        ) : (
          <div className="m-1">No messages.</div>
        )}
      </div>
    </div>
  );
};

const Filters = (props: {}) => {
  const { f, toggleLvl } = props;

  const style = (active: boolean) =>
    active ? "- mx-1 btn-sm p-0" : " mx-1 btn-sm p-0";

  return (
    <>
      <div
        className={"text-secondary" + style(f.d)}
        onClick={() => toggleLvl("d")}
      >
        debug
      </div>
      <div className={`text-info` + style(f.i)} onClick={() => toggleLvl("i")}>
        info
      </div>
      <div
        className={`text-warning` + style(f.w)}
        onClick={() => toggleLvl("w")}
      >
        warn
      </div>
      <div
        className={`text-danger` + style(f.e)}
        onClick={() => toggleLvl("e")}
      >
        error
      </div>
    </>
  );
};
export default Log;
