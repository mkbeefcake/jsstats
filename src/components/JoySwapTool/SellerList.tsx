import React, { useEffect, useState } from "react";
import { IState  } from "../../ptypes";
import SubBlock from "../ui/SubBlock";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../ui/TablePaginationActions';
import { Button, makeStyles, Typography } from "@material-ui/core";

export interface ISeller {
    seller: string,
    price: number,
    amount: number
}

function Seller (props: { seller: ISeller }) {
    const { seller } = props

	return (
		<TableRow key={seller.seller}>
			<TableCell>{seller.seller}</TableCell>
			<TableCell><i>{Number.isNaN(seller.price) ? "-" : seller.price}</i></TableCell>
			<TableCell><i>{seller.amount}</i></TableCell>
			<TableCell>
                <Button variant="outlined">Buy</Button>
            </TableCell>
		</TableRow>
	);
}

const useStyles = makeStyles({
	table: {
	},
    desc: { flexGrow: 1, backgroundColor: "#4038FF", boxShadow: "none", paddingLeft:"16px" },
})

const sellerGroups: ISeller[] = [
    {seller: "mkblockchaindev", price: 0.06, amount: 100000},
    {seller: "xxxxxxxx", price: 0.05623, amount: 40000},
    {seller: "yyyyyyy", price: 0.05975, amount: 40000},
    {seller: "aaaaaa", price: 0.05975, amount: 40000},
    {seller: "bbbbb", price: 0.05975, amount: 40000},
    {seller: "zzzzz", price: 0.05623, amount: 40000},
]

const SellerList = (props: IState) => {
	const {} = props	

    const classes = useStyles()
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
        <SubBlock title="$JOY Token Sellers" stretch={8} >
            <>
                <Typography variant="h6" className={classes.desc}>
                    The normal JOY price is $0.06 USD. This tool can help people to purchase/buy JOY tokens around that price before DEX listing.
                </Typography>
                <Button variant="outlined" style={{marginTop: 20}}>Auto Buy</Button>
                <TableContainer style={{ padding: 10 }}>
                    <Table className={classes.table} aria-label="sell-order table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Seller</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        {sellerGroups && ( 
                            <TableBody>
                                { rowsPerPage > 0 ? 
                                        sellerGroups.slice(page * rowsPerPage, page *rowsPerPage + rowsPerPage)
                                            .map((seller) => <Seller key={seller.seller} seller={seller} />)
                                    : sellerGroups.map((seller) => <Seller key={seller.seller} seller={seller} />)
                                }
                            </TableBody>
                        )}
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[4]}
                                    colSpan={4}
                                    count={sellerGroups ? sellerGroups.length : 0}
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
        </SubBlock>
    );
}

export default SellerList;
