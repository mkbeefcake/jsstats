import React from "react";
import { ListGroup} from "react-bootstrap";
import axios from "axios";

import { Burner } from "../../types";

interface IProps {
}

interface IState {
  burners: Burner[]
}

class Burners extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      burners: [] as Burner[]
    };
  }

  componentDidMount() {
      const backend = `https://validators.joystreamstats.live/burners`;

      axios.get(backend).then((response) => {this.setState({burners: response.data})});
  }

  
  render() {

    const { burners } = this.state;

    return (
      <div>
        <h3>Top Token Burners</h3>
        <>
        { (!burners || burners.length === 0) ? <div/> :
        <ListGroup>
          <ListGroup.Item key={`header`}>
            <div className="d-flex flex-row justify-content-between">
              <div>Wallet</div>
              <div>Amount Burned</div>
            </div>
          </ListGroup.Item>
          {burners.map(brn => (
            <ListGroup.Item key={brn.wallet}>
                <div className="d-flex flex-row justify-content-between" key={brn.wallet}>
                <div>{brn.wallet}</div>
                <div>{brn.totalburned}</div>
                </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        } </>
      </div>
    );
  }
}

export default Burners;
