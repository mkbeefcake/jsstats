import React, { useEffect, useState } from "react";
import { IState  } from "../../ptypes";
import { Container, Grid, TableContainer } from "@material-ui/core";
import { ConnectWallet } from './ConnectWallet'
import Banner from "../ui/Banner";
import SubBlock from "../ui/SubBlock";

const SellerList = (props: IState) => {
	const {} = props	

	console.log(`joyswaptool screen`)

    return (
        <SubBlock title="$JOY Token Sellers" stretch={8}>
            Sell Order List
        </SubBlock>
    );
}

export default SellerList;
