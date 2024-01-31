import React from "react";
import { LinearProgress, LinearProgressProps, Typography } from "@mui/material";
import { withStyles, createStyles } from "@mui/styles";

type LinearProgressBarProps = LinearProgressProps & {
  value: number;
};

const CustomProgressBar = withStyles(() =>
  createStyles({
    root: {
      height: 16,
      borderRadius: 11,
      border: "2px solid #03bcdb80",
    },
    colorPrimary: {
      backgroundColor: "#F1F9FA",
    },
    bar: {
      borderRadius: 11,
      backgroundColor: "#03BCDB;",
      padding: 0,
    },
  }),
)(LinearProgress);

const LinearProgressBar = ({ value, ...rest }: LinearProgressBarProps) => (
  <div
    style={{
      position: "relative",
      margin: "8px",
      width: "100%",
      marginTop: 24,
    }}
  >
    <CustomProgressBar variant="determinate" value={value} {...rest} />
    <Typography
      style={{
        position: "absolute",
        width: 48,
        fontSize: 14,
        textAlign: "center",
        color: "black",
        top: -24,
        left: `calc(${value}% - 24px)`,
        transition: "all 0.4s linear 0s",
      }}
    >
      {value}%
    </Typography>
  </div>
);
export default LinearProgressBar;
