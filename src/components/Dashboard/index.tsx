import Events from '../Events'

interface IProps extends IState {
  blocks: { id: number; events: any }[];
}

const Dashboard = (props: IProps) => {
  return <Events selectEvent={props.selectEvent} blocks={props.blocks} />
};

export default Dashboard;
