import styled from "@emotion/styled";
import { InputBase } from "@mui/material";

import theme from "src/theme";

const InputCustom = styled(InputBase)({
  "&.MuiInputBase-root": {
    color: `${theme.gray}`,
  },
  "& .MuiInputBase-input": {
    padding: 0,
    maxHeight: "60px",
    overflowX: "hidden!important" as any,
    overflowY: "auto!important" as any,
    "&::-webkit-scrollbar ": {
      width: "5px",
      backgroundColor: "#f5f5f5",
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: "10px",
      backgroundColor: "#f5f5f5",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "10px",
      backgroundColor: "#c1c1c1",
    },
  },
});

export default InputCustom;
