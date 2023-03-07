import React, { useEffect, useState } from "react";
import { IState  } from "../../types";
import { Container, Grid, TableContainer } from "@material-ui/core";
import { ConnectWallet } from './ConnectWallet'
import SellerList from './SellerList'
import Banner from "../ui/Banner";
import SubBlock from "../ui/SubBlock";

const JoySwapTool = (props: IState) => {
	const {} = props	

	console.log(`joyswaptool screen`)

  return (
    <div style={{ flexGrow: 1 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <ConnectWallet {...props} />
					<SellerList {...props} />
        </Grid>
      </Container>
    </div>
  );
}

export default JoySwapTool;
