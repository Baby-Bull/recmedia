import React, { memo, useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSelector, useDispatch } from "react-redux";

import styles from "src/components/home/home.module.scss";
import { IStoreState } from "src/constants/interface";
import actionTypes from "src/store/actionTypes";
import { getUserStatics } from "src/services/user";

interface IMatchingItemProps {
  label: string;
  data: number;
  unit: string;
  link: string;
}

interface IMatchingItemMobileProps {
  icon: string;
  // data: number;
  label: string;
  link: string;
}

const MatchingItem: React.SFC<IMatchingItemProps> = ({ label, data, unit, link }) => {
  const router = useRouter();
  const handleRedirectMatching = (type: string) => {
    router.push({
      pathname: "/matching",
      query: { type },
    });
  };
  return (
    <Box className={styles.boxMatching} onClick={() => handleRedirectMatching(link)}>
      <div className="label">
        <span>{label}</span>
      </div>
      <ArrowForwardIosIcon sx={{ fontSize: "10px", fontWeight: "bold", marginLeft: "-3em" }} />
      <div className="div-data">
        <span className="data">{data}</span>
        <span className="unit">{unit}</span>
      </div>
    </Box>
  );
};

const MatchingItemMobile: React.SFC<IMatchingItemMobileProps> = ({ label, icon, link }) => {
  const router = useRouter();
  const handleRedirectMatching = (type: string) => {
    router.push({
      pathname: "/matching",
      query: { type },
    });
  };
  return (
    <Box className={styles.boxMatchingMobile} onClick={() => handleRedirectMatching(link)}>
      <img src={icon} alt="icon" />
      <span className="label-type">{label}</span>
      {/* {data ? <span className="span-has-data" /> : ""} */}
    </Box>
  );
};

const MatchingComponent = memo(() => {
  const dispatch = useDispatch();
  const auth = useSelector((state: IStoreState) => state.user);
  useEffect(() => {
    const fetchNewDataStatics = async () => {
      const res = await getUserStatics();
      auth.review_count = res.review_count;
      auth.match_request_count = res.match_request_count;
      auth.match_request_rejected_count = res.match_request_rejected_count;
      auth.match_request_pending_count = res.match_request_pending_count;
      auth.match_request_confirmed_count = res.match_request_confirmed_count;
      auth.match_application_count = res.match_application_count;
      auth.match_application_rejected_count = res.match_application_rejected_count;
      auth.match_application_pending_count = res.match_application_pending_count;
      auth.match_application_confirmed_count = res.match_application_confirmed_count;
      auth.favorite_count = res.favorite_count;
      auth.community_count = res.community_count;
      dispatch({ type: actionTypes.UPDATE_PROFILE, payload: auth });
    };
    fetchNewDataStatics();
  }, []);

  const { t } = useTranslation();

  const [dataMatching, setDataMatching] = useState<any>({
    request: {
      label: t("home:matching.request-m"),
      data: auth?.match_application_count ?? 0,
      unit: t("home:matching.request-unit"),
      link: "received",
    },
    application: {
      label: t("home:matching.application-m"),
      data: auth?.match_request_pending_count ?? 0,
      unit: t("home:matching.application-unit"),
      link: "sent",
    },
    people: {
      label: t("home:matching.people-m"),
      data: auth?.favorite_count ?? 0,
      unit: t("home:matching.people-unit"),
      link: "favorite",
    },
    community: {
      label: t("home:matching.community-m"),
      data: auth?.community_count ?? 0,
      unit: t("home:matching.community-unit"),
      link: "community",
    },
  });

  const [dataMatchingMobile, setDataMatchingMobile] = useState<any>({
    request: {
      label: t("home:matching.request-m"),
      data: auth?.match_application_count ?? 0,
      icon: "/assets/images/home_page/ic_user.svg",
      link: "received",
    },
    application: {
      label: t("home:matching.application-m"),
      data: auth?.match_request_pending_count ?? 0,
      icon: "/assets/images/home_page/ic_hand.svg",
      link: "type=sent",
    },
    people: {
      label: t("home:matching.people-m"),
      data: auth?.favorite_count ?? 0,
      icon: "/assets/images/home_page/ic_heart_blue.svg",
      link: "favorite",
    },
    chat: {
      label: t("home:matching.matched-m"),
      data: 1,
      icon: "/assets/images/svg/perm_contact_calendar.svg",
      link: "matched",
    },
    community: {
      label: t("home:matching.community-m"),
      data: auth?.community_count ?? 0,
      icon: "/assets/images/home_page/ic_star_circle.svg",
      link: "community",
    },
  });

  useEffect(() => {
    setDataMatching({
      request: {
        label: t("home:matching.request-m"),
        data: auth?.match_application_pending_count ?? 0,
        unit: t("home:matching.request-unit"),
        link: "received",
      },
      application: {
        label: t("home:matching.application-m"),
        data: auth?.match_request_pending_count ?? 0,
        unit: t("home:matching.application-unit"),
        link: "sent",
      },
      people: {
        label: t("home:matching.people-m"),
        data: auth?.favorite_count ?? 0,
        unit: t("home:matching.people-unit"),
        link: "favorite",
      },
      community: {
        label: t("home:matching.community-m"),
        data: auth?.community_count ?? 0,
        unit: t("home:matching.community-unit"),
        link: "community",
      },
    });

    setDataMatchingMobile({
      request: {
        label: t("home:matching.request-m"),
        data: auth?.match_application_count ?? 0,
        icon: "/assets/images/home_page/ic_user.svg",
        link: "received",
      },
      application: {
        label: t("home:matching.application-m"),
        data: auth?.match_request_pending_count ?? 0,
        icon: "/assets/images/home_page/ic_hand.svg",
        link: "sent",
      },
      people: {
        label: t("home:matching.people-m"),
        data: auth?.favorite_count ?? 0,
        icon: "/assets/images/home_page/ic_heart_blue.svg",
        link: "favorite",
      },
      chat: {
        label: t("home:matching.matched-m"),
        data: 1,
        icon: "/assets/images/svg/perm_contact_calendar.svg",
        link: "matched",
      },
      community: {
        label: t("home:matching.community-m"),
        data: auth?.community_count ?? 0,
        icon: "/assets/images/home_page/ic_star_circle.svg",
        link: "community",
      },
    });
  }, [auth]);

  return (
    <Grid container>
      <Grid container className={classNames(styles.matchingGridContainer, "content-pc")}>
        {Object.keys(dataMatching)?.map((key, index) => (
          <Grid item key={index}>
            <MatchingItem
              label={dataMatching[key]?.label}
              unit={dataMatching[key]?.unit}
              data={dataMatching[key]?.data}
              link={dataMatching[key]?.link}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container className={classNames(styles.matchingGridContainerMobile, "content-mobile")}>
        {Object.keys(dataMatchingMobile)?.map((key, index) => (
          <Grid item key={index} className={styles.matchingGridItem}>
            <MatchingItemMobile
              label={dataMatchingMobile[key]?.label}
              icon={dataMatchingMobile[key]?.icon}
              // data={dataMatchingMobile[key]?.data}
              link={dataMatchingMobile[key]?.link}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
});

export default MatchingComponent;
