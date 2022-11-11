//import Events from "../Events";
import Media from "../Media";

interface IProps extends IState {
  blocks: { id: number; events: any }[];
}

const Dashboard = (props: IProps) => {
  const { save, selectVideo, media, categories } = props;
  return (
    <Media
      save={save}
      media={media}
      selectVideo={selectVideo}
      categories={categories}
    />
  );
};

export default Dashboard;
