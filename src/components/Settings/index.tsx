import Json from "../Data/Json";
import Data from "../Data";

const Settings = (props: {}) => {
  const { settings } = props;
  return (
    <div className="box">
      <h1>Settings</h1>

      <div className="text-left">
        <Json src={settings} />

        <Data {...props} />
      </div>
    </div>
  );
};

export default Settings;
