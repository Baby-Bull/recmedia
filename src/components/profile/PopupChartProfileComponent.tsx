import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import { Avatar, Box, Typography } from "@mui/material";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { Radar } from "react-chartjs-2";
import { useTranslation } from "next-i18next";

import styles from "src/components/profile/profile.module.scss";
import theme from "src/theme";
import { labels, dataChart, config } from "src/mockDataChartProfile";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface IReportUserProps {
  showPopup: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowPopup: (status: boolean) => void;
}

/* event change select option */
const DialogChartProfile = styled(Dialog)({
  "& .MuiPaper-root": {
    maxWidth: "100%",
  },
  "& .MuiDialog-paper": {
    justifyContent: "center",
    backgroundColor: `${theme.blue}`,
    borderRadius: "12px",
    width: "640px",
    margin: 0,
  },
  "@media (max-width: 1200px)": {
    "& .MuiDialog-paper": {
      width: "93%",
    },
  },
});

const PopupChartProfileComponent: React.SFC<IReportUserProps> = ({ showPopup, setShowPopup }) => {
  const { t } = useTranslation();
  const handleClose = () => {
    setShowPopup(false);
  };

  const data = {
    labels,
    datasets: [
      {
        data: dataChart,
        backgroundColor: "rgba(3,188,219, 0.3)",
        borderColor: "rgba(3,188,219,0.3)",
        borderWidth: 0,
      },
    ],
  };

  const options = config;

  return (
    <Box
      sx={{
        background: "red",
      }}
    >
      <DialogChartProfile
        open={showPopup}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* Delete this element after completing the profile chart feature. */}
        <Box className={styles.commingSoon}>
          <span className={styles.commingSoonTitle}>coming soon ...</span>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            m: "10px 10px 0 0",
            cursor: "pointer",
          }}
          onClick={handleClose}
        >
          <Avatar
            src="/assets/images/icon/ic_close_white.png"
            sx={{ width: { xs: "24px", lg: "42px" }, height: { xs: "24px", lg: "42px" } }}
          />
        </Box>
        <DialogTitle id="alert-dialog-title" sx={{ mb: { xs: "33px", lg: "18px" }, p: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              fontWeight={700}
              fontSize={20}
              color="#fff"
              sx={{ lineHeight: { xs: "32px", lg: "24px" }, textAlign: "center", display: { xs: "none", lg: "block" } }}
            >
              {t("profile:popup.chart.title")}
            </Typography>
            <Typography
              fontWeight={700}
              fontSize={20}
              color="#fff"
              sx={{ lineHeight: { xs: "32px", lg: "24px" }, textAlign: "center", display: { xs: "block", lg: "none" } }}
            >
              {t("profile:popup.chart.title-mb1")}
              <br />
              {t("profile:popup.chart.title-mb2")}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: "0 27px 40px 27px", lg: "0 80px 40px 80px" } }}>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#fff",
                p: "20px 20px 20px 10px",
                borderRadius: "50%",
                boxShadow: "0px 4px 16px rgba(32, 54, 120, 0.14)",
              }}
            >
              <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                <Radar data={data} options={options} />
              </Box>
              <Box sx={{ position: "absolute", left: "50%", transform: "translate(-50%, 0)" }}>
                <Avatar
                  src="/assets/images/icon/ic_user_chart.png"
                  sx={{ width: { xs: "31px", lg: "53px" }, height: { xs: "31px", lg: "53px" } }}
                />
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
      </DialogChartProfile>
    </Box>
  );
};

export default PopupChartProfileComponent;
