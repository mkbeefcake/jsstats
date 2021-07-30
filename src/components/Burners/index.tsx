import React from "react";
import { Table} from "react-bootstrap";
import axios from "axios";

import { alternativeBackendApis } from "../../config"

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
      const backend = `${alternativeBackendApis}/burners`;
      axios.get(backend).then((response) => {this.setState({burners: response.data})});
  }

  
  render() {
    const { burners } = this.state;

    return (
      <div className="box">
        <h3>Top Token Burners</h3>
        <>
        { (!burners || burners.length === 0) ? <h4>No records found</h4> :
          <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Amount Burned</th>
            </tr>
          </thead>
          <tbody>
            {burners.map(brn => (
              <tr key={brn.wallet}>
                <td>{brn.wallet}</td>
                <td>{brn.totalburned}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        } </>
      </div>
    );
  }
}

export default Burners;
