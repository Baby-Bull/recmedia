import { Box, Button, Fade, Modal, Grid } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

import styles from "src/components/character/character.module.scss";

import LinearProgressBar from "./LinerProgressBar";

const CharacterComponent = () => {
  const [modalNo, setModalNo] = React.useState(1);

  const { t } = useTranslation();

  const BtnSave = styled(Button)({
    width: "240px",
    height: "56px",
    marginTop: "80px",
    borderRadius: "28px",
    "@media (max-width: 1200px)": {
      marginBottom: "31px",
      marginTop: "66px",
    },
  });

  const handleSave = () => {
    setModalNo(modalNo + 1);
  };

  const handleBack = () => {
    setModalNo(modalNo - 1);
  };

  return (
    <React.Fragment>
      {modalNo === 1 && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div style={{ outline: "none" }}>
            <Fade in>
              <div className={styles.modalWrapper}>
                <p className={styles.titleContent}>{t("character:character-diagnosis")}</p>
                <Box className={styles.modalBox}>
                  <div className={styles.modalContent}>{t("character:character-description")}</div>
                  <div className={styles.modalContentSmall}>{t("character:character-description-small")}</div>
                </Box>
                <Grid container flexDirection="row" justifyContent="center" alignItems="center">
                  <Grid item className={styles.square}>
                    {t("character:start1")}
                  </Grid>
                  <Grid item className={styles.square}>
                    {t("character:start2")}
                  </Grid>
                  <Grid item className={styles.square}>
                    {t("character:start3")}
                  </Grid>
                  <Grid item className={styles.square}>
                    {t("character:start4")}
                  </Grid>
                  <Grid item className={styles.square}>
                    {t("character:start5")}
                  </Grid>
                  <Grid item className={styles.square}>
                    {t("character:start6")}
                  </Grid>
                </Grid>
                <BtnSave
                  className={styles.button}
                  sx={{
                    background: "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)",
                    fontSize: 16,
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)",
                    },
                  }}
                  onClick={handleSave}
                >
                  {t("character:start-diagnosis")}
                </BtnSave>
              </div>
            </Fade>
          </div>
        </Modal>
      )}
      {modalNo === 2 && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div style={{ outline: "none" }}>
            <Fade in>
              <div className={styles.modalWrapper}>
                <p className={styles.titleContent}>{t("character:character-diagnosis")}</p>
                <Box className={styles.modalBoxQuestion}>
                  <div className={styles.modalContent}>
                    {t("character:please-select-the-one-that-applies-to-you-from-the-questions")}
                  </div>
                  <LinearProgressBar value={0} />
                </Box>
                <div className={styles.question}>
                  <div className={styles.question_number}>
                    <p className={styles.question_number_text}>1</p>
                  </div>
                  <div style={{ fontSize: 18 }}>{t("character:question1")}</div>
                  <div style={{ marginTop: 40, marginBottom: 49 }}>
                    <Button className={styles.answerButton} onClick={handleSave}>
                      {t("character:1-yes")}
                    </Button>
                    <Button className={styles.answerButton} onClick={handleSave}>
                      {t("character:2-no")}
                    </Button>
                  </div>
                </div>
                <div className={styles.hint}>
                  <div className={styles.hintTitle}>{t("character:hint")}</div>
                  <div>{t("character:hint-content")}</div>
                  <div>{t("character:hint-answer")}</div>
                </div>
              </div>
            </Fade>
          </div>
        </Modal>
      )}
      {modalNo === 3 && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div style={{ outline: "none" }}>
            <Fade in>
              <div className={styles.modalWrapper}>
                <p className={styles.titleContent}>{t("character:character-diagnosis")}</p>
                <Box className={styles.modalBoxQuestion}>
                  <div className={styles.modalContent}>
                    {t("character:please-select-the-one-that-applies-to-you-from-the-questions")}
                  </div>
                  <LinearProgressBar value={48} />
                </Box>
                <div className={styles.question}>
                  <div className={styles.question_number}>
                    <p className={styles.question_number_text}>1</p>
                  </div>
                  <div style={{ fontSize: 18 }}>{t("character:question1")}</div>
                  <div style={{ marginTop: 40 }}>
                    <Button className={styles.answerButton} onClick={handleSave}>
                      {t("character:1-yes")}
                    </Button>
                    <Button className={styles.answerButton} onClick={handleSave}>
                      {t("character:2-no")}
                    </Button>
                  </div>
                  <BtnSave
                    sx={{
                      background: "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)",
                      fontSize: 16,
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)",
                      },
                    }}
                    onClick={handleBack}
                  >
                    {t("character:to-the-previous-answer")}
                  </BtnSave>
                </div>
              </div>
            </Fade>
          </div>
        </Modal>
      )}
      {modalNo === 4 && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div style={{ outline: "none" }}>
            <Fade in>
              <div className={styles.modalWrapper}>
                <p className={styles.titleContent}>{t("character:character-diagnosis")}</p>
                <Box className={styles.modalBoxQuestion}>
                  <div className={styles.modalContent}>{t("character:question-complete")}</div>
                  <LinearProgressBar value={100} />
                </Box>
                <div className={styles.question}>
                  <BtnSave
                    sx={{
                      background: "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)",
                      fontSize: 16,
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)",
                      },
                    }}
                  >
                    {t("character:view-diagnostic-results")}
                  </BtnSave>
                </div>
              </div>
            </Fade>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};
export default CharacterComponent;
