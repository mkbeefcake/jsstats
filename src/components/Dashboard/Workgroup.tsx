import React from "react";
import SubBlock from "./ui/SubBlock";
import { ElectedCouncil } from "@/queries";
import { useWorkingGroups, useWorker } from '@/hooks';
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

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  }),
);

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		console.log('first button is clicked')
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		console.log('back button is clicked')
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		console.log('next button is clicked')
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		console.log('last button is clicked')
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div >
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

export function GroupWorkers(props: { council: ElectedCouncil, workingGroup : WorkingGroup }) {

	const { council, workingGroup } = props;
	const { workingTokens, rewardToken, workingTokensReward } = useWorkingGroups({ council });
	const { exitedWorker, filledWorker, terminatedWorker } = useWorker({ council });

	var token = workingTokens?.filter((data) => workingGroup.name === data.groupId).reduce((a: number, b) => {
		return a + (b.budgetChangeAmount / 10000000000);
	}, 0)

	var reward = rewardToken?.filter((data) => workingGroup.name === data.groupId).reduce((a: number, b) => {
		return a + (b.amount / 10000000000);
	}, 0)

	var updateReward = workingTokensReward?.filter((data) => workingGroup.name === data.groupId).reduce((a: number, b) => {
		return a + (b.budgetChangeAmount / 10000000000);
	}, 0)

	var budget = updateReward! - reward!;


	var exited = exitedWorker?.filter(data => workingGroup.name === data.groupId).reduce((a: number, b) => {
		return isNaN(a + b.worker.length) ? 0 : a + b.worker.length;
	}, 0)

	var filled = filledWorker?.filter(data => workingGroup.name === data.groupId).reduce((a: number, b) => {
		return isNaN(a + b.workersHired.length) ? 0 : a + b.workersHired.length;
	}, 0)

	var terminated = terminatedWorker?.filter(data => workingGroup.name === data.groupId).reduce((a: number, b) => {
		return isNaN(a + b.worker.length) ? 0 : a + b.worker.length;
	}, 0)

	var worker = filled! - exited! - terminated!;

	return (
		<TableRow key={workingGroup.name}>
			<TableCell>{workingGroup.name}</TableCell>
			<TableCell><i>{Number.isNaN(worker) ? "-" : worker}</i></TableCell>
			<TableCell><i>{token?.toFixed(0)}</i></TableCell>
			<TableCell><i>{budget.toFixed(0)}</i></TableCell>
		</TableRow>
	);
}

const useStyles2 = makeStyles({
	table: {
		minWidth: 500,
	}
})

const WorkGroup = (props: { council: ElectedCouncil | undefined}) => {
  const { council } = props;
  const { workingGroups, loading, error } = useWorkingGroups({ council });

	const classes = useStyles2();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(4);
	
  const handleChangePage = (event: unknown, newPage: number) => {
		console.log(`handlechangepage : ${newPage}`)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log(`handleChangeRowsPerPage: ${parseInt(event.target.value, 10)}`)
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

	return (
    <SubBlock title="WorkGroup" stretch={true}>
      { !loading && (
				<>
					<TableContainer>
						<Table className={classes.table} aria-label="working-group table">
							<TableHead>
								<TableRow>
									<TableCell>Working Groups</TableCell>
									<TableCell>Workers</TableCell>
									<TableCell>Minted Tokens during Term</TableCell>
									<TableCell>Budget/Debt at end of Term</TableCell>
								</TableRow>
							</TableHead>
							{workingGroups && ( <>
								<TableBody>
									{ /*rowsPerPage > 0 ? 
											workingGroups.slice(page * rowsPerPage, page *rowsPerPage + rowsPerPage)
												.map((workingGroup) => <GroupWorkers key={workingGroup.id} council={council} workingGroup={workingGroup} />)
										:*/ workingGroups.map((workingGroup) => <GroupWorkers key={workingGroup.id} council={council} workingGroup={workingGroup} />)
									}
								</TableBody>
							</>)}
							{/* <TableFooter>
								<TableRow>
									<TablePagination
										rowsPerPageOptions={[4]}
										colSpan={3}
										count={workingGroups ? workingGroups.length : 0}
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
							</TableFooter> */}
						</Table>
					</TableContainer>
				</>
      )}
    </SubBlock>
  );
};

export default WorkGroup;
