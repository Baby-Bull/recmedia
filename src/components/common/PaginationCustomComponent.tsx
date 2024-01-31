import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import theme from "src/theme";

export const PaginationCustom = styled(Pagination)({
  display: "flex",
  justifyContent: "center",
  "& .MuiButtonBase-root": {
    "&.MuiPaginationItem-previousNext.Mui-disabled": {
      display: "none",
    },
    "&.Mui-selected": {
      color: "white",
      backgroundColor: theme.blue,
      fontWeight: 700,

      "&:hover": {
        backgroundColor: theme.blue,
        opacity: 0.8,
      },
    },
  },

  "& .MuiPaginationItem-root": {
    color: theme.blue,
    fontWeight: 700,
    marginRight: "5px",
    "&:not(.MuiPaginationItem-previousNext)": {},
    "&:hover": {
      opacity: 0.5,
    },
  },
});

interface IPaginationProps {
  handleCallbackChangePagination?: any;
  page?: number;
  perPage?: number;
  totalPage?: number;
}

const PaginationCustomComponent: React.SFC<IPaginationProps> = ({
  handleCallbackChangePagination,
  page,
  perPage,
  totalPage,
}) => (
  <Stack spacing={2}>
    <PaginationCustom
      count={perPage > totalPage ? totalPage : perPage}
      page={page}
      siblingCount={1}
      onChange={handleCallbackChangePagination}
    />
  </Stack>
);

export default PaginationCustomComponent;
