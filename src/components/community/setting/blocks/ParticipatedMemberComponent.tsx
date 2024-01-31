import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import theme from "src/theme";
import EmptyComponent from "src/components/community/setting/blocks/EmptyComponent";
import GridViewComponent from "src/components/community/setting/blocks/GridViewComponent";
import { getParticipates } from "src/services/community";
import PaginationCustomComponent from "src/components/common/PaginationCustomComponent";

interface IParticipationComponentProps {
  isPublic?: boolean;
  handleChangeTab?: any;
}
const ParticipationComponent: React.SFC<IParticipationComponentProps> = ({ isPublic, handleChangeTab }) => {
  const { t } = useTranslation();
  const LIMIT = 10;
  const router = useRouter();

  const [participates, setParticipates] = useState([]);
  const [countParticipates, setCountParticipates] = useState(0);
  const [checkLoading, setCheckLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(2);
  const [valueCursor, setCursor] = useState("");
  // end pagination

  const fetchDataParticipates = async (cursor: string = "") => {
    const communityId = router.query;
    const resData = await getParticipates(communityId?.indexId, LIMIT, cursor);
    setCheckLoading(true);
    // eslint-disable-next-line no-unsafe-optional-chaining
    setParticipates([...participates, ...resData?.items]);
    setCountParticipates(resData?.items_count ?? 0);
    setCursor(resData?.cursor);
    return resData;
  };

  const handleCallbackChangePaginationParticipates = (event, value) => {
    setCheckLoading(false);
    setPage(value);
    if (perPage <= value) {
      setPerPage(perPage + 1);
      fetchDataParticipates(valueCursor ?? "");
    }
    setCheckLoading(true);
  };

  useEffect(() => {
    fetchDataParticipates();
  }, []);

  const callbackHandleRemoveMember = async (indexMember) => {
    setParticipates(participates.filter((_, index) => index !== indexMember));
    setCountParticipates(countParticipates - 1);
    if (participates.length < 2 + (page - 1) * 10 && page > 1) {
      handleCallbackChangePaginationParticipates("onClick", page - 1);
    }
    if (participates.length <= 10 && participates.length < countParticipates) {
      const communityId = router.query;
      const resData = await getParticipates(communityId?.indexId, LIMIT, "");
      setCheckLoading(true);
      setParticipates(resData?.items);
      setCursor(resData?.cursor);
      return resData;
    }
  };

  return (
    <Box
      sx={{
        mr: [0, "17.32%"],
        backgroundColor: [theme.whiteBlue, "white"],
        borderRadius: "12px",
      }}
    >
      {checkLoading && (
        <Box>
          {countParticipates > 0 && (
            <Typography
              sx={{
                fontWeight: 500,
                py: ["20px", "28px"],
                px: [0, "40px"],
                textAlign: ["center", "left"],
              }}
            >
              {`${t("community:setting.participation.title")} ${countParticipates}${t(
                "community:setting.participation.subject",
              )}`}
            </Typography>
          )}
          {countParticipates > 0 ? (
            participates?.slice((page - 1) * LIMIT, page * LIMIT).map((data, index) => (
              <React.Fragment key={index.toString()}>
                <GridViewComponent
                  data={data}
                  index={index + (page - 1) * LIMIT}
                  callbackHandleRemoveElmMember={callbackHandleRemoveMember}
                />
              </React.Fragment>
            ))
          ) : (
            <Box>
              {isPublic ? (
                <EmptyComponent
                  text={t("community:setting.participation.empty-public1")}
                  text2={t("community:setting.participation.empty-public2")}
                  text3={t("community:setting.participation.empty-public3")}
                  text4={t("community:setting.participation.empty-public4")}
                  text5={t("community:setting.participation.empty-public5")}
                  handleChangeTab={handleChangeTab}
                />
              ) : (
                <EmptyComponent text={t("community:setting.participation.empty-private")} />
              )}
            </Box>
          )}
        </Box>
      )}
      <Box
        sx={{
          py: "40px",
          display: "flex",
          justifyContent: "center",
          borderTop: { sm: `1px solid ${theme.lightGray}` },
        }}
      >
        {countParticipates > LIMIT && (
          <PaginationCustomComponent
            handleCallbackChangePagination={handleCallbackChangePaginationParticipates}
            page={page}
            perPage={perPage}
            totalPage={Math.ceil(countParticipates / LIMIT)}
          />
        )}
      </Box>
    </Box>
  );
};
export default ParticipationComponent;
