import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import React from "react";
import { makeStyles, Theme } from "@material-ui/core";

const useStylesBootstrap = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    border: "1px solid #fff",
    backgroundColor: "#4038FF",
    fontSize: '0.8rem'
  },
}));

const InfoTooltip = (props: TooltipProps) => {
  const classes = useStylesBootstrap();
  return <Tooltip classes={classes} {...props} />;
};

export default InfoTooltip;
