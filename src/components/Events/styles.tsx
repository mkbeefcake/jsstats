import { makeStyles, createStyles, Theme } from "@material-ui/core";

export const eventsStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      backgroundColor: "#000",
      color: "#fff",
    },
    appBar: {
      flexGrow: 1,
      backgroundColor: "#4038FF",
    },
    title: {
      textAlign: "left",
      flexGrow: 1,
    },
    acc: {
      color: "#fff",
      backgroundColor: "#000",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
      position: "absolute",
      width: "100%",
    },
    chips: {
      display: "flex",
      justifyContent: "center",
      "& > *": {
        margin: theme.spacing(1, 1, 1, 0),
      },
    },
    stakeChip: {
      margin: theme.spacing(1),
    },
    accSummary: {
      textAlign: "center",
      color: "#fff",
      backgroundColor: "#4038FF",
    },
    badge: {
      marginTop: theme.spacing(1),
    },
    backersTooltip: {
      cursor: "pointer",
    },
    backerInfo: {
      textAlign: "center",
    },
    dividerPrimary: {
      backgroundColor: "#4038FF",
    },
  })
);
