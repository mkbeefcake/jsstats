import Events from "../Events";
import Media from "../Media";

interface IProps extends IState {
  blocks: { id: number; events: any }[];
}

const Dashboard = (props: IProps) => {
  const { save, selectVideo, media, hidden, selectEvent, blocks } = props;
  return <Media save={save} media={media} selectVideo={selectVideo} />;
};

export default Dashboard;
