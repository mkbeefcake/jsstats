import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { ISeller } from '../SellerList'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      background: "dodgerblue",
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const BuyOrderDialog = (props: {open: boolean, handleClose: any, seller: ISeller}) => {
  const { open, handleClose, seller} = props

  console.log(`seller: `, seller) 

  return (
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Buy
        </DialogTitle>
        <DialogContent dividers style={{background:"dodgerblue"}}>
          <div style={{display:'flex', flexDirection:'column', gap:16}} >
            <TextField
              required
              id="outlined-required"
              label="Seller"
              defaultValue={seller && seller.seller}
              inputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
            <TextField
              required
              id="outlined-required"
              label="JOY PRICE"
              defaultValue="0.06"
              inputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
            <TextField
              required
              id="outlined-required"
              label="JOY AMOUNT"
              defaultValue="1000"
              variant="outlined"
            />
          </div>
        </DialogContent>
        <DialogActions style={{background:"dodgerblue"}}>
          <Button autoFocus onClick={handleClose} color="primary">
            Order
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default BuyOrderDialog;