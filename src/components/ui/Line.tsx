import React from "react";
import {
  Box
} from "@material-ui/core";

const Line = (props: {
    content: String,
    value: Number
}) => {
  const { 
    content,
    value
  } = props;

  return (
    <Box sx={{ display: 'flex', paddingLeft:'16px', paddingRight:'16px', color: '#000' }} >
			<Box sx={{ flexGrow: 1, textAlign: "left" }}>{content}</Box>
			<Box sx={{ textAlign: "right" }}><i>{value}</i></Box>
    </Box>
  );
};

export default Line;
