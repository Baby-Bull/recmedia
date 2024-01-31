import React from "react";
import { Box } from "@mui/material";

import theme from "src/theme";
import ButtonComponent from "src/components/common/ButtonComponent";

interface IEmptyComponentProps {
  children: any;
  textButton?: string;
  hiddenButton?: boolean;
  mtButton?: {
    xs?: string;
    md?: string;
  };
  bgButton?: string;
  absolute?: boolean;
  handleClick?: () => void;
}

const EmptyComponent: React.SFC<IEmptyComponentProps> = ({
  children,
  textButton,
  hiddenButton,
  mtButton,
  bgButton,
  absolute,
  handleClick,
}) => (
  <Box
    sx={{
      pt: [absolute ? "130px" : "0", absolute ? "170px" : "80px"],
      height: [absolute ? "466px" : "237px", absolute ? "601px" : "545px"],
      display: "flex",
      flexDirection: "column",
      justifyContent: [absolute ? "flex-start" : "space-around", "unset"],
      alignItems: "center",
      border: [!absolute && `1px solid ${theme.blue}`, !absolute && `2px solid ${theme.whiteGray}`],
      borderRadius: "0 0 12px 12px",
      position: absolute ? "absolute" : "unset",
      left: absolute && "50%",
      top: absolute && "0",
      width: absolute && "101%",
      transform: absolute && "translate(-50%, 0)",
      backdropFilter: absolute && "blur(10px)",
      backgroundColor: absolute && "rgba(255, 255, 255, 0.5)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        color: theme.navy,
        fontWeight: 400,
      }}
    >
      <Box
        sx={{
          fontSize: ["14px", "16px"],
        }}
      >
        {children}
      </Box>
    </Box>

    <ButtonComponent
      props={{
        mode: !bgButton && "gradient",
        bgColor: bgButton,
      }}
      sx={{
        display: hiddenButton ? "none" : "inherit",
        mt: [mtButton?.xs || "0", mtButton?.md || "80px"],
      }}
      onClick={handleClick}
    >
      {textButton}
    </ButtonComponent>
  </Box>
);
export default EmptyComponent;
