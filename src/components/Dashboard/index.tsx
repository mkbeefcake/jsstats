import Events from '../Events'

interface IProps extends IState {
  blocks: { id: number; events: any }[];
}

const Dashboard = (props: IProps) => {
  const { save, hidden, selectEvent, blocks} = props
  return <Events save={save} hidden={hidden} selectEvent={selectEvent} blocks={blocks} />
};

export default Dashboard;
