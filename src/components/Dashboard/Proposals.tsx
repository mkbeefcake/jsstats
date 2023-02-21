import React from "react";
import SubBlock from "./ui/SubBlock";
import { ElectedCouncil } from "@/queries";
import { useProposals } from '@/hooks';
import { Proposal, WorkingGroup } from "../../types";

import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from "./ui/TablePaginationActions";

const useStyles2 = makeStyles({
	table: {
		minWidth: 500,
	}
})

const ProposalWorker = (props: {proposal: Proposal} ) => {
	const { proposal } = props;

	return (
		<TableRow key={proposal.id}>
			<TableCell>{proposal.title}</TableCell>
			<TableCell><i>{proposal.createdAt}</i></TableCell>
			<TableCell>
				<a
					href={`https://pioneerapp.xyz/#/proposals/preview/${proposal.id}`}
					target="_blank"
					rel="noreferrer"
					style={{color: 'blue'}}
				>
					<i>Link to proposal</i>
				</a>
			</TableCell>
			<TableCell><i>{proposal.status}</i></TableCell>
		</TableRow>								
	);
};

const Proposals = (props: { council: ElectedCouncil | undefined}) => {
  const { council } = props;
  const { proposals, loading, error } = useProposals({ council });

	const classes = useStyles2();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(4);
	
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

	return (
    <SubBlock title="Proposals" stretch={6}>
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
									{rowsPerPage > 0 ? 
											proposals.slice(page * rowsPerPage, page *rowsPerPage + rowsPerPage)
												.map((proposal) => <ProposalWorker proposal={proposal}/>)
										: proposals.map((proposal) => <ProposalWorker proposal={proposal} />)
									}
								</TableBody>
							</>)}
							<TableFooter>
								<TableRow>
									<TablePagination
										rowsPerPageOptions={[4]}
										colSpan={4}
										count={proposals ? proposals.length : 0}
										rowsPerPage={rowsPerPage}
										page={page}
										onPageChange={handleChangePage}
										SelectProps={{
											inputProps: { 'aria-label': 'rows per page' },
											native: true,
										}}
										onRowsPerPageChange={handleChangeRowsPerPage}
										ActionsComponent={TablePaginationActions}
									/>
								</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</>
      )}
    </SubBlock>
  );
};

export default Proposals;
