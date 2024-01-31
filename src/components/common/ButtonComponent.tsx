import React from "react";
import { Button, ButtonProps, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";

import theme from "src/theme";

type Dimension = "tiny" | "x-small" | "small" | "x-medium" | "medium" | "large";
interface IButtonComponentProps extends ButtonProps {
  children: any;
  props?: {
    mode?: string;
    dimension?: Dimension;
    color?: string;
    height?: string;
    bgColor?: string;
    borderColor?: string;
    square?: boolean;
  };
  nestedCondition?: any;
}

const ButtonRounded = styled(Button)<IButtonComponentProps>(
  ({ props, nestedCondition = (condition: any, then: any, otherwise: any) => (condition ? then : otherwise) }) => ({
    borderColor: props?.borderColor || "black",
    backgroundColor: props?.bgColor || "white",
    "&:hover": {
      borderColor: props?.borderColor || "black",
      backgroundColor: props?.bgColor || "white",
      opacity: 0.9,
    },
    color: props?.color || "white",
    width: nestedCondition(
      props?.dimension === "tiny",
      "120px",
      nestedCondition(
        props?.dimension === "x-small",
        "160px",
        nestedCondition(
          props?.dimension === "small",
          "184px",
          nestedCondition(
            props?.dimension === "x-medium",
            "200px",
            nestedCondition(props?.dimension === "medium", "240px", "280px"),
          ),
        ),
      ),
    ),
    height: props?.height || 40,
    borderRadius: props?.square ? 4 : 40,
    fontSize: 16,
    fontWeight: 700,
    textTransform: "capitalize",
    "&.Mui-disabled": {
      color: theme.gray,
    },
  }),
);

const ButtonGoogle = styled(ButtonRounded)({
  color: theme.navy,
  backgroundColor: "white",
  borderColor: "#DADADA",
  "&:hover": {
    borderColor: "black",
  },
});

const ButtonGradient = styled(ButtonRounded)({
  background: theme.gd,
});

function renderSwitch(children, props, rest) {
  switch (props?.mode) {
    case "twitter":
      return (
        <ButtonRounded
          props={{ bgColor: "#55ACEE" }}
          disableElevation
          startIcon={
            <Avatar variant="square" sx={{ width: "100%", height: "100%" }} src="/assets/images/svg/twitter.svg" />
          }
          {...rest}
        >
          {children}
        </ButtonRounded>
      );
    case "google":
      return (
        <ButtonGoogle
          variant="outlined"
          disableElevation
          startIcon={<Avatar sx={{ width: "100%", height: "100%" }} src="/assets/images/svg/google.svg" />}
          {...rest}
        >
          {children}
        </ButtonGoogle>
      );
    case "github":
      return (
        <ButtonRounded
          props={{ bgColor: "#101010" }}
          disableElevation
          startIcon={
            <Avatar variant="square" sx={{ width: "100%", height: "100%" }} src="/assets/images/logo/logo_github.png" />
          }
          {...rest}
        >
          {children}
        </ButtonRounded>
      );
    case "gradient":
      return (
        <ButtonGradient props={props} {...rest}>
          {children}
        </ButtonGradient>
      );
    default:
      return (
        <ButtonRounded props={props} {...rest}>
          {children}
        </ButtonRounded>
      );
  }
}

const ButtonComponent: React.SFC<IButtonComponentProps> = ({ children, props, ...rest }) => (
  <React.Fragment>{renderSwitch(children, props, rest)}</React.Fragment>
);

export default ButtonComponent;
