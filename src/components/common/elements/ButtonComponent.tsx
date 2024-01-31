import React, { ReactNode } from "react";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import theme from "src/theme";

const ButtonRounded = styled(Button)({
  borderRadius: 40,
  textTransform: "capitalize",
  "&:hover": {
    opacity: 0.9,
  },
});

const ButtonGreen = styled(ButtonRounded)({
  background: theme.green,
  "&:hover": {
    background: theme.green,
  },
  color: "white",
});

const ButtonDefault = styled(ButtonRounded)({
  background: theme.gray,
  "&:hover": {
    background: theme.gray,
  },
  color: "white",
});

const ButtonOrange = styled(ButtonRounded)({
  background: theme.orange,
  "&:hover": {
    background: theme.orange,
  },
  color: "white",
});

const ButtonCleam = styled(ButtonRounded)({
  background: theme.cleam,
  "&:hover": {
    background: theme.cleam,
  },
  color: theme.navy,
});

const ButtonBlue = styled(ButtonRounded)({
  background: theme.blue,
  "&:hover": {
    background: theme.blue,
  },
  color: "white",
});

const ButtonGradient = styled(ButtonRounded)({
  background: theme.gd,
  "&:hover": {
    background: theme.gd,
  },
  color: "white",
});

function renderSwitch(mode, children, rest) {
  switch (mode) {
    case "green":
      return <ButtonGreen {...rest}>{children}</ButtonGreen>;
    case "orange":
      return <ButtonOrange {...rest}>{children}</ButtonOrange>;
    case "info":
      return <ButtonBlue {...rest}>{children}</ButtonBlue>;
    case "cleam":
      return <ButtonCleam {...rest}>{children}</ButtonCleam>;
    case "gradient":
      return <ButtonGradient {...rest}>{children}</ButtonGradient>;
    default:
      return <ButtonDefault {...rest}>{children}</ButtonDefault>;
  }
}

interface ButtonComponentProps extends ButtonProps {
  children: ReactNode | string;
  mode: string;
}

const ButtonComponent: React.SFC<ButtonComponentProps> = ({ children, mode, ...rest }) => (
  <React.Fragment>{renderSwitch(mode, children, rest)}</React.Fragment>
);

export default ButtonComponent;
