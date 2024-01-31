import React, { useState } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "next-i18next";

import theme from "src/theme";
import CommentComponent from "src/components/community/post/detail/blocks/CommentComponent";
import ButtonComponent from "src/components/common/ButtonComponent";
import PaginationCustomComponent from "src/components/common/PaginationCustomComponent";

interface IListCommentProps {
  comments?: any;
  page?: number;
  perPage?: number;
  totalComment?: number;
  handleCallBackPaginationIndex?: any;
  handleCallbackRemove?: any;
  handleCallbackChangeStatusOrder?: any;
  checkLoadingComment?: boolean;
}

const ListCommentComponent: React.SFC<IListCommentProps> = ({
  comments,
  page,
  perPage,
  totalComment,
  handleCallBackPaginationIndex,
  handleCallbackRemove,
  checkLoadingComment,
  handleCallbackChangeStatusOrder,
}) => {
  const { t } = useTranslation();
  const LIMIT = 10;
  const handleCallbackChangePagination = (event, value) => {
    handleCallBackPaginationIndex(value, perPage);
  };
  const LATEST = "latest";
  const OLDEST = "oldest";

  const [order, setOrder] = useState(OLDEST);

  const handleChangeStatusOrder = (statusOrder) => {
    setOrder(statusOrder);
    handleCallbackChangeStatusOrder(statusOrder, 0, 1, 2, "");
  };
  return (
    <Box
      sx={{
        border: `2px solid ${theme.whiteGray}`,
        backgroundColor: "white",
        borderRadius: "12px",
        mt: "8px",
        mb: "20px",
        pt: ["20px", "40px"],
        px: ["15px", "40px"],
      }}
    >
      {checkLoadingComment && (
        <Box>
          {totalComment > 0 ? (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: "16px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    px: "12px",
                    borderLeft: `1px solid ${theme.lightGray_1}`,
                    borderRight: `1px solid ${theme.lightGray_1}`,
                  }}
                >
                  <ButtonComponent
                    variant="text"
                    sx={{
                      color: order === OLDEST ? theme.blue : "black",
                      width: "46px",
                      height: "24px",
                      fontSize: 14,
                      textTransform: "capitalize",
                      mr: "4px",
                    }}
                    onClick={() => handleChangeStatusOrder(OLDEST)}
                  >
                    {t("community:detail.comment.posting-order")}
                  </ButtonComponent>

                  <ButtonComponent
                    variant="text"
                    sx={{
                      color: order === LATEST ? theme.blue : "black",
                      width: "46px",
                      height: "24px",
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                    onClick={() => handleChangeStatusOrder(LATEST)}
                  >
                    {t("community:detail.comment.latest-order")}
                  </ButtonComponent>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: "38px",
                }}
              >
                {totalComment > LIMIT && (
                  <PaginationCustomComponent
                    handleCallbackChangePagination={handleCallbackChangePagination}
                    page={page}
                    perPage={perPage}
                    totalPage={Math.ceil(totalComment / LIMIT)}
                  />
                )}
              </Box>
              <Box
                sx={{
                  color: theme.navy,
                }}
              >
                {comments?.map((item, index) => (
                  <CommentComponent
                    itemData={item}
                    index={index + 10 * (page - 1)}
                    key={index.toString()}
                    handleCallbackRemove={handleCallbackRemove}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", pb: "40px" }}>{t("community:post.no-data")}</Box>
          )}
        </Box>
      )}
    </Box>
  );
};
export default ListCommentComponent;
