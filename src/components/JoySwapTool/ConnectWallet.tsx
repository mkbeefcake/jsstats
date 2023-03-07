import React, { useEffect, useState } from "react";
import { IState  } from "../../types";
import SubBlock from "../ui/SubBlock";
import { Button, Container } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Line from "../ui/Line";
import SellOrderDialog from './components/SellOrderDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    section: {
      margin:'10px !important', 
      background:'bottom', 
      border: '1px solid black', 
      borderRadius: '10px' 
    }
  }),
);


export const ConnectWallet = (props: IState) => {  

  const classes = useStyles();
  const [isShowSell, setIsShowSell] = useState(false);

  const onHandleSell = () => {
    setIsShowSell(true)
  }

  const onHandleClose = () => {
    setIsShowSell(false)
  }

  return (
    <SubBlock title="My Wallet">
      <div className={classes.root}>
        <div style={{display: 'flex', justifyContent: 'space-evenly', margin: '10px' }} >
          <Button variant="outlined">Connect Wallet</Button>
          <Button variant="outlined" onClick={onHandleSell} >Sell</Button>
        </div>
        <Accordion className={classes.section}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Polkadot DOT Wallet</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{width:'100%'}}>
              <Line content={"Address"} value={"XXXXXXXXXXXXXXXXXXXXX"} />
              <Line content={"Balance"} value={"YYYYYYYYYYYYYYYYYYYYY"} />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion className={classes.section}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography className={classes.heading}>Joystream Wallet</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{width:'100%'}}>
              <Line content={"Address"} value={"XXXXXXXXXXXXXXXXXXXXX"} />
              <Line content={"Balance"} value={"YYYYYYYYYYYYYYYYYYYYY"} />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion className={classes.section}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography className={classes.heading}>Transactions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{width:'100%'}}>
              <Line content={"Buy"} value={"6 DOT => 1000 JOY "} />
              <Line content={"Sell"} value={"200 JOY => 1.5 DOT"} />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div>
        <SellOrderDialog open={isShowSell} handleClose={onHandleClose} />
      </div>
    </SubBlock>
  );
}
