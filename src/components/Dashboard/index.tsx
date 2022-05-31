import Events from "../Events";
import Media from "../Media";

interface IProps extends IState {
  blocks: { id: number; events: any }[];
}

const Dashboard = (props: IProps) => {
  const { save, media, hidden, selectEvent, blocks } = props;
  return (
    <>
      <Media save={save} media={media} />
      <Events
        save={save}
        hidden={hidden}
        selectEvent={selectEvent}
        blocks={blocks}
      />
    </>
  );
};

export default Dashboard;
