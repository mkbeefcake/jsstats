import React from "react";
import { ListGroup } from "react-bootstrap";
import Loading from "../Loading";
import axios from "axios";

interface iProps {}

class Bounties extends React.Component<iProps> {
  constructor(iProps: {}) {
    super(iProps);

    this.state = { bounties: [] };
  }

  componentDidMount() {
    this.fetchBounties();
  }

  async fetchBounties() {
    const bounties = [
      ["#", "Title", "Reward", "Forum Thread", "Manager, Co", "Status/Grading"],
      [
        9,
        "Repo/Docs Improvements",
        "$400",
        "https://testnet.joystream.org/#/forum/threads/216",
        "@oiclid#4024 (Discord)",
        "Weekly Bounty",
      ],
      [
        16,
        "Translation of Community Update Videos",
        "$400",
        "https://testnet.joystream.org/#/forum/threads/510",
        "@Mikhail#7681 (Discord) @mmsawww (TG)",
        "Open",
      ],
      [
        18,
        "Original Video Bounty",
        "up to $200",
        "https://testnet.joystream.org/#/forum/threads/422",
        "@Skipper#0353 (Discord), @IgreX#0267 (Discord) @igrex (TG)",
        "Open",
      ],
      [
        20,
        "Github Bounty Guide",
        "$350",
        "https://testnet.joystream.org/#/forum/threads/492",
        "@isonar#5236 (Discord) @isonar (TG)",
        "Open",
      ],
      [
        21,
        "Website Translation",
        "$500",
        "https://testnet.joystream.org/#/forum/threads/493",
        "freakstatic#0197 (Discord), @isonar#5236 (Discord) @isonar (TG)",
        "Open",
      ],
    ];

    //console.log(`Fetching bounties`);
    //const { data } = await axios.get(`/static/bounties.json`);
    //console.debug(`bounties`, JSON.parse(data));
    if (bounties) this.setState({ bounties });
  }

  render() {
    const { bounties } = this.state;
    if (!bounties.length) <Loading target={`bounties`} />;

    return (
      <div className="m-2 p-1 bg-light">
        <h4>Bounties</h4>
        <ListGroup>
          {bounties.map((b) => (
            <Bounty key={b} bounty={b} />
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default Bounties;

const Bounty = (props: { bounty: string[] }) => {
  const [id, title, reward, thread, manager, status] = props.bounty;
  return (
    <ListGroup.Item className="d-flex flex-row">
      <div className="col-2">{id}</div>
      <div className="col-4">
        <a href={thread}>{title}</a>
      </div>
      <div className="col-2">{reward}</div>
      <div className="col-2">{manager}</div>
      <div className="col-2">{status}</div>
    </ListGroup.Item>
  );
};
