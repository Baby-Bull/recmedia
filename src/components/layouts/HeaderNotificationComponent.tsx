import { useRouter } from "next/router";
import React, { useState, FC } from "react";
import { useQuery } from "react-query";
import { connect } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import InfiniteScroll from "react-infinite-scroll-component";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";

import theme from "src/theme";
import styles from "src/components/layouts/layout.module.scss";
import { CONTENT_OF_NOTIFICATIONS, REACT_QUERY_KEYS } from "src/constants/constants";
import { getListnotifications, readNotification } from "src/services/user";
import actionTypes from "src/store/actionTypes";

type Props = {
  anchor: any;
  notifications: any;
  // eslint-disable-next-line no-unused-vars
  updateNotifications: (payload: any) => void;
  onClose: () => void;
};

type UserDataInNotification = {
  id: string;
  username: string;
  profile_image: string;
};
type CommunityDataInNotification = {
  id: string;
  name: string;
  profile_image: string;
};

type DataRedirectNotification = {
  match_request_id?: string;
  user?: UserDataInNotification;
  community_join_request_id?: string;
  community_id?: string;
  community?: CommunityDataInNotification;
  comment_id?: string;
  post_id?: string;
};

const HeaderNotificationComponent: FC<Props> = ({ anchor, notifications, updateNotifications, onClose }) => {
  const router = useRouter();
  const [notificationCursor, setNotificationCursor] = useState({ cursor: null });

  useQuery(
    [REACT_QUERY_KEYS.LIST_NOTIFICATIONS, notificationCursor],
    async () => {
      const newNotifications = await getListnotifications(10, notificationCursor.cursor);
      updateNotifications({
        items: notificationCursor.cursor ? [...notifications.items, ...newNotifications.items] : newNotifications.items,
        cursor: newNotifications.cursor,
        hasMore: newNotifications.hasMore,
      });
    },
    { refetchOnWindowFocus: false },
  );

  const loadMoreNotifications = async () => {
    setNotificationCursor({ cursor: notifications?.cursor });
  };

  const handleRedirectNotification = (typeOfMessage: string, dataOfMessage: DataRedirectNotification) => {
    switch (typeOfMessage) {
      case "new_matching_request":
        router.push("/matching?type=received");
        break;
      case "matching_request_accepted":
        router.push("/matching?type=matched");
        break;
      case "new_community_join_request":
        router.push(`/community/setting/${dataOfMessage?.community_id}`);
        break;
      case "community_join_request_accepted":
        router.push(`/community/${dataOfMessage?.community?.id}`);
        break;
      case "new_comment_in_post":
        router.push(`/community/${dataOfMessage?.community_id}/post/detail/${dataOfMessage?.post_id}`);
        break;
      case "new_recommend_user":
        router.push(`/profile/${dataOfMessage?.user?.id}`, undefined, { shallow: true });
        break;
      case "tagged_in_comment":
        router.push(`/community/${dataOfMessage?.community_id}/post/detail/${dataOfMessage?.post_id}`);
        break;
      default:
        break;
    }
  };

  const handleClickNotification = (notificationData) => {
    readNotification(notificationData.id);
    handleRedirectNotification(notificationData.notification_type, notificationData.metadata);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchor}
      className={styles.notificationMenu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id="primary-search-account-menu-notification"
      keepMounted
      open
      onClose={onClose}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        zIndex: 10001,
        ".MuiPaper-root": {
          borderRadius: "12px !important",
        },
      }}
    >
      <InfiniteScroll
        dataLength={notifications?.items?.length || 0}
        next={loadMoreNotifications}
        hasMore={notifications?.hasMore}
        height={650}
        loader={
          <Box sx={{ display: "flex", py: "15px", justifyContent: "center" }}>
            <CircularProgress sx={{ color: theme.blue }} size={30} />
          </Box>
        }
      >
        <div className={styles.notificationMenuHeader}>お知らせ</div>
        <Box sx={{ paddingTop: "50px" }}>
          {notifications?.items?.length ? (
            notifications?.items?.map((dataMap: any) => (
              <MenuItem
                key={dataMap.id}
                className={styles.notificationMenuItem}
                onClick={() => handleClickNotification(dataMap)}
              >
                <div className={styles.notificationImage}>
                  <Avatar
                    alt={dataMap?.metadata?.user?.username || dataMap?.metadata?.community?.name}
                    src={dataMap?.metadata?.user?.profile_image || dataMap?.metadata?.community?.profile_image}
                    sx={{
                      width: "50px",
                      height: "50px",
                      ".MuiAvatar-img": {
                        objectFit:
                          dataMap?.metadata?.community?.profile_image === "/assets/images/logo/logo.png"
                            ? "contain!important"
                            : "cover",
                      },
                    }}
                  />
                </div>
                <div className={styles.notificationContents}>
                  {!dataMap.is_read ? (
                    <div className={styles.notificationContent}>
                      {
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        `${
                          (dataMap.metadata?.user?.username || dataMap.metadata?.community?.name || "") +
                          // eslint-disable-next-line no-unsafe-optional-chaining
                          CONTENT_OF_NOTIFICATIONS[dataMap?.notification_type]?.label
                        } ${dataMap?.metadata?.post_id ? dataMap?.metadata?.post_id : ""} ${
                          CONTENT_OF_NOTIFICATIONS[dataMap?.notification_type]?.label2
                        }`
                      }
                    </div>
                  ) : (
                    <div>
                      {
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        `${
                          (dataMap.metadata?.user?.username || dataMap.metadata?.community?.name || "") +
                          // eslint-disable-next-line no-unsafe-optional-chaining
                          CONTENT_OF_NOTIFICATIONS[dataMap?.notification_type]?.label
                        } ${dataMap?.metadata?.post_id ? dataMap?.metadata?.post_id : ""} ${
                          CONTENT_OF_NOTIFICATIONS[dataMap?.notification_type]?.label2
                        }`
                      }
                    </div>
                  )}
                  <div className={styles.createdTime}>
                    {new Date(dataMap?.created_at).getDate() === new Date().getDate()
                      ? dayjs(dataMap?.created_at).format("HH:mm")
                      : dayjs(dataMap?.created_at).format("YYYY/MM/DD")}
                  </div>
                </div>
              </MenuItem>
            ))
          ) : (
            <Box
              sx={{
                width: "328px",
                display: "flex",
                height: "550px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <b>通知はありません。</b>
            </Box>
          )}
        </Box>
      </InfiniteScroll>
    </Menu>
  );
};

export default connect(
  (state: any, ownProps: any) => ({
    anchor: ownProps.anchor,
    notifications: state.notifications,
  }),
  (dispatch, ownProps: any) => ({
    updateNotifications: (payload: any) => dispatch({ type: actionTypes.UPDATE_NOTIFICATIONS, payload }),
    onClose: ownProps.onClose,
  }),
)(HeaderNotificationComponent);
