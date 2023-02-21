import React from "react";
import SubBlock from "./ui/SubBlock";
import { ElectedCouncil } from "@/queries";
import { useProposals } from '@/hooks';
import { WorkingGroup } from "../../types";

import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const Proposals = (props: { council: ElectedCouncil | undefined}) => {
  const { council } = props;
  const { proposals, loading, error } = useProposals({ council });

	return (
    <SubBlock title="Proposals" stretch={true}>
      { !loading && (
				<>
					<TableContainer>
						<Table aria-label="proposals table">
							<TableHead>
								<TableRow>
									<TableCell>Title</TableCell>
									<TableCell>Created Date</TableCell>
									<TableCell>Link</TableCell>
									<TableCell>Status</TableCell>
								</TableRow>
							</TableHead>
							{proposals && ( <>
								<TableBody>
									{
										proposals.map((proposal) => 
											<TableRow key={proposal.id}>
												<TableCell>{proposal.title}</TableCell>
												<TableCell><i>{proposal.createdAt}</i></TableCell>
												<TableCell>
													<a
														href={`https://pioneerapp.xyz/#/proposals/preview/${proposal.id}`}
														target="_blank"
														rel="noreferrer"
													>
														Link to porposal
													</a>
												</TableCell>
												<TableCell><i>{proposal.status}</i></TableCell>
											</TableRow>								
										)
									}
								</TableBody>
							</>)}
						</Table>
					</TableContainer>
				</>
      )}
    </SubBlock>
  );
};

export default Proposals;
