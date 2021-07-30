import React from "react";
import { Form, Table} from "react-bootstrap";
import axios from "axios";
import Pagination from 'react-bootstrap/Pagination'

import { alternativeBackendApis } from "../../config"

import { ValidatorApiResponse } from "../../types";

interface IProps {
}

interface IState {
    address: string
    blockStart: number
    blockEnd: number
    page: number,
    apiResponse: ValidatorApiResponse;
}

class ValidatorReport extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      address: '',
      blockStart: 0,
      blockEnd: 0,
      page: 1,
      apiResponse: {} as ValidatorApiResponse
    };
    this.accountTxFilterChanged = this.accountTxFilterChanged.bind(this);
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    let { address, blockStart, blockEnd, page } = this.state;

    if(blockStart !== prevState.blockStart || blockEnd != prevState.blockEnd) {

      console.log(`Fetching transactions`);
      const backend = `${alternativeBackendApis}/validator-report?addr=${address}&start_block=${blockStart}&end_block=${blockEnd}&page=${page}`;

      axios.get(backend).then((response) => {this.setState({...this.state, apiResponse: response.data})});
    }
  }

  accountTxFilterChanged(address: string) {
    if(this.state.address !== address) {
      this.setState({...this.state, address: address });
    }
  }

  startBlockFilterChanged(blockStart: number) {
    if(this.state.blockStart !== blockStart) {
      this.setState({...this.state, blockStart: blockStart });
    }
  }

  endBlockFilterChanged(blockEnd: number) {
    if(this.state.blockEnd !== blockEnd) {
      this.setState({...this.state, blockEnd: blockEnd });
    }
  }

  totalPages(): number {
    const pageSize = this.state.apiResponse?.pageSize ?? 50
    const result =  1 + (this.state.apiResponse?.totalCount ?? 1) / pageSize
    return Math.floor(result)
  }
  
  changePage(page: number) {
    if(this.state.page !== page) {
      this.setState({...this.state, page: page });
    }
  }


  render() {

    const { address, blockStart, blockEnd, apiResponse, page } = this.state;

    return (
      <div className="box">
        <h3>Validator Report</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control type="address" placeholder="Wallet account" onChange={(e) => this.accountTxFilterChanged(e.target.value)} value={address}/>
            <Form.Text className="text-muted">
              48 character string starting with 5
            </Form.Text>
            <Form.Control type="blockStart" placeholder="Start Block" onChange={(e) => this.startBlockFilterChanged(+e.target.value)} value={blockStart}/>
            <Form.Control type="blockEnd" placeholder="End Block" onChange={(e) => this.endBlockFilterChanged(+e.target.value)} value={blockEnd}/>
          </Form.Group>
        </Form>
        <>
        { (!apiResponse || !apiResponse.report) ? <h4>No records found</h4> :
          <>
            { (this.totalPages() <= 1) ? <div/> :
            <Pagination>
              {[...Array(this.totalPages())].map((i) => {
                <Pagination.Item key={i} active={i === page} onClick={() => this.changePage(i)}>
                  {i}
                </Pagination.Item>
                })
              }
            </Pagination>
            }
            
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Era</th>
                <th>Total Stake</th>
                <th>Own Stake</th>
                <th>Points</th>
                <th>Rewards</th>
                <th>Commission</th>
                <th>Blocks Produced</th>
              </tr>
            </thead>
            <tbody>
              {apiResponse.report.map(tx => (
                      <tr key={tx.id}>
                        <td>{tx.id}</td>
                        <td>{tx.stakeTotal}</td>
                        <td>{tx.stakeOwn}</td>
                        <td>{tx.points}</td>
                        <td>{tx.rewards}</td>
                        <td>{tx.commission}</td>
                        <td>{tx.blocksCount}</td>
                      </tr>
                    ))}
            </tbody>
          </Table>
          </>
        } </>
      </div>
    );
  }
}

export default ValidatorReport;
