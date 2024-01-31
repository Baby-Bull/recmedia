/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, useCallback } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import dynamic from "next/dynamic";

import theme from "src/theme";
import websocket from "src/helpers/socket";
import "react-toastify/dist/ReactToastify.css";
import { IStoreState } from "src/constants/interface";
import { CONTENT_OF_NOTIFICATIONS, TYPE_OF_NOTIFICATIONS } from "src/constants/constants";
import { getUserStatics, readAllNotifications } from "src/services/user";
import actionTypes from "src/store/actionTypes";
import { logout } from "src/services/auth";
import { customizeContentNotificationBrowser, notify } from "src/utils/utils";
import { ChatMessage } from "src/types/models/ChatMessage";
import { getItem, setItem, TRIGGER_REFRESH } from "src/helpers/storage";

interface IHeaderComponentProps {
  authPage?: boolean;
}

const HeaderNotificationComponent = dynamic(() => import("./HeaderNotificationComponent"));
const HeaderChatComponent = dynamic(() => import("./HeaderChatComponent"));

const Search = styled("div")({
  marginRight: theme.spacing(2),
  backgroundColor: "#FFFFFF",
  border: "1px solid #D8D8D8",
  borderRadius: "12px",
  width: "320px",
  marginLeft: "37px",
  height: "40px",
  display: "flex",
  "@media (max-width: 1200px)": {
    display: "none",
  },
});

const SearchIconWrapper = styled("div")({
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#03BCDB",
  zIndex: "99999",
  padding: "11px 8px 7px 17px",
});

const StyledInputBase = styled(InputBase)({
  "& .MuiInputBase-input": {
    width: "150px",
    marginRight: "8px",
    height: "100%",
  },
});

const StyledButtonList = styled(Button)({
  color: theme.navy,
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "13.17px",
  height: "48px",
  marginLeft: "40px",
  "@media (max-width: 1200px)": {
    marginLeft: "10px",
    fontSize: "12px",
    lineHeight: "17.38px",
    height: "30px",
  },
});

const SelectCustom = styled(Select)({
  borderRadius: 6,
  width: "100%",
  height: "40px",
  color: theme.navy,
  "& fieldset": {
    border: "none",
  },
  "&:hover": {
    borderRadius: 6,
  },
  "@media (max-width: 1200px)": {
    width: "100%",
  },
  "& .MuiSelect-select": {
    position: "relative",
    fontSize: 14,
    padding: "10px 11px",
    borderRadius: "12px",
    fontFamily: "Noto Sans",
  },
});

const MenuItemCustom = styled(MenuItem)({
  padding: "8px 0",
  width: "160px",
});

const IconButtonCustom = styled(IconButton)({
  padding: 0,
});

const TypoLabel = styled(Typography)({
  fontSize: "12px",
  lineHeight: "17.38px",
  color: theme.navy,
  marginLeft: "4px",
});

const typeSearchs = [
  {
    value: "エンジニア",
    label: "エンジニア",
  },
  {
    value: "コミュニティ",
    label: "コミュニティ",
  },
];

const HeaderComponent: React.FC<IHeaderComponentProps> = React.memo(({ authPage }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const fullText = router.query?.fulltext;
  const auth = useSelector((state: IStoreState) => state.user);
  const notifications = useSelector((state: IStoreState) => state.notifications);
  const listRoomsChatUnread = useSelector((state: IStoreState) => state.listrooms.unread_count);
  const triggerRefresh = getItem(TRIGGER_REFRESH);

  // block function Messages ***********************************************************
  const [statusChatMenu, setStatusChatMenu] = useState(false);
  const [menuChatAnchorEl, setMenuChatAnchorEl] = React.useState(null);

  const statusAuthPage = !auth || authPage;

  const handleMenuChatClose = useCallback(() => {
    setMenuChatAnchorEl(null);
    setStatusChatMenu(false);
  }, []);

  React.useEffect(() => {
    async () => {
      if (triggerRefresh === "true") {
        setItem(TRIGGER_REFRESH, "false");
        const stats = await getUserStatics();
        dispatch({
          type: actionTypes.UPDATE_PROFILE,
          payload: stats,
        });
        dispatch({
          type: actionTypes.UPDATE_UNREAD_LISTROOMS_COUNT,
          payload: { count: stats.chat_room_with_unread_messages },
        });
        dispatch({
          type: actionTypes.UPDATE_NOTIFICATION_UNREAD_COUNT,
          payload: { count: stats.notification_unread_count },
        });
      }
    };
  }, []);

  const handleOpenMenuChat = (event: any) => {
    if (isMobile) {
      router.push("/chat/personal");
    } else {
      setMenuChatAnchorEl(event.currentTarget);
      setStatusChatMenu(true);
    }
  };

  // Notifications ********************************************
  const [statusNotify, setStatusNotify] = useState(false);
  const [notifyAnchorEl, setNotifyAnchorEl] = React.useState(null);

  const handleNotifyMenuClose = useCallback(() => {
    setNotifyAnchorEl(null);
    setStatusNotify(false);
  }, []);
  const handleNotifyOpenMenu = async (event: any) => {
    setNotifyAnchorEl(event.currentTarget);
    setStatusNotify(true);
    if (notifications?.unread_count > 0) await readAllNotifications();
    dispatch({
      type: actionTypes.REMOVE_UNREAD_NOTIFICATIONS_COUNT,
    });
  };

  useEffect(() => {
    const handleNewChatMessageNotify = (chatMessage: ChatMessage) => {
      if (!isMobile) {
        if (Notification.permission === "granted") {
          notify(
            `${chatMessage?.user?.username}`,
            chatMessage?.content_type === "text" ? `${chatMessage.content}` : "添付ファイル",
            `${chatMessage?.user?.profile_image}`,
          );
        }
      }
    };
    const handleNewNotification = (notification) => {
      dispatch({
        type: actionTypes.ADD_NOTIFICATION,
        payload: {
          notification,
        },
      });
      if (!isMobile) {
        if (Notification.permission === "granted") {
          notify(
            `${notification?.metadata?.user?.username || notification?.metadata?.community?.name}`,
            customizeContentNotificationBrowser(
              notification?.notification_type,
              notification?.metadata?.user?.username || notification?.metadata?.community?.name,
              notification?.metadata?.post_id,
              CONTENT_OF_NOTIFICATIONS[notification?.notification_type]?.label,
              CONTENT_OF_NOTIFICATIONS[notification?.notification_type]?.label2,
            ),
            `${notification?.metadata?.user?.profile_image || notification?.metadata?.community?.profile_image}`,
          );
        }
      }
    };
    const handleUpdateUnreadMessages = ({ chat_room_with_unread_messages: count }) => {
      dispatch({
        type: actionTypes.UPDATE_UNREAD_LISTROOMS_COUNT,
        payload: { count },
      });
    };
    websocket.on(`get.chatRoom.message`, handleNewChatMessageNotify);
    websocket.on(`user.chat_room_with_unread_messages`, handleUpdateUnreadMessages);
    websocket.on(`get.community.chatRoom.message`, handleNewChatMessageNotify);
    // eslint-disable-next-line array-callback-return
    TYPE_OF_NOTIFICATIONS.map((notificationType) => {
      websocket.on(`get.notification.${notificationType}`, handleNewNotification);
    });
    if (!isMobile) {
      if (Notification.permission === "denied" && notifications?.askPermissionNotification) {
        window.alert("You denied permission. Please change your browser settings for this page to view notifications");
        dispatch({ type: actionTypes.UPDATE_PERMISSION_NOTIFICATION });
      } else if (Notification.permission === "default" && notifications?.askPermissionNotification) {
        Notification.requestPermission();
        dispatch({ type: actionTypes.UPDATE_PERMISSION_NOTIFICATION });
      }
    }
    return () => {
      websocket.off("get.chatRoom.message", handleNewChatMessageNotify);
      websocket.off(`get.user.chat_room_with_unread_messages`, handleUpdateUnreadMessages);
      websocket.off("get.community.chatRoom.message", handleNewChatMessageNotify);
      // eslint-disable-next-line array-callback-return
      TYPE_OF_NOTIFICATIONS.map((notificationType) => {
        websocket.off(`get.notification.${notificationType}`, handleNewNotification);
      });
    };
  }, []);

  // block function Menu ****************************************
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleOpenMenu = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  // end block function Menu ***********************************

  // block search **************************************************
  const [typeSearch, setTypeSearch] = React.useState(typeSearchs[1].label);
  const [valueSearch, setValueSearch] = useState(fullText);
  const handleChange = (event: any) => {
    setTypeSearch(event.target.value);
  };
  const handleRedirectMatching = (type: string) => {
    router.push({
      pathname: "/matching",
      query: { type },
    });
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      setValueSearch(e.target.value);
      if (typeSearch === typeSearchs[0].value) {
        router.push({
          pathname: "/search_user",
          query: { fulltext: e.target.value },
        });
      }
      if (typeSearch === typeSearchs[1].value) {
        router.push({
          pathname: "/search_community",
          query: { fulltext: e.target.value },
        });
      }
    }
  }; // end block search ***********************************

  const handleLogout = async () => {
    await logout();
    dispatch({ type: actionTypes.LOGOUT });
    router.push(`/login?oldUrl=${window.location.pathname}`);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{ zIndex: 10001 }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      sx={{
        zIndex: 10001,
        top: "9px",
        "& .MuiMenu-paper": {
          width: "160px",
          borderRadius: "12px",
        },
      }}
    >
      <Box sx={{ p: "22px 0 22px 12px", borderBottom: "1px solid #D8D8D8" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={auth?.profile_image}
            alt={auth?.username}
            sx={{ width: "20px", height: "20px", mr: "4px", borderRadius: "50%" }}
          />
          <Typography fontWeight={500} fontSize={12} lineHeight="17.38px">
            マイプロフィール
          </Typography>
        </Box>
        <Button
          sx={{
            width: "124px",
            height: "32px",
            borderRadius: "4px",
            border: "0.5px solid #989EA8",
            mt: "27px",
            padding: "6px 13px",
          }}
        >
          <Link href="/my-profile" prefetch={false}>
            <a
              style={{
                color: theme.navy,
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "17.38px",
                textDecoration: "none",
              }}
            >
              {t("header.profile-editing")}
            </a>
          </Link>
        </Button>
      </Box>
      <Box sx={{ m: "20px 0 0px 12px" }} onClick={handleMenuClose}>
        <Link href="/chat/personal" prefetch={false}>
          <MenuItemCustom>
            <IconButtonCustom size="large" aria-label="show 4 new mails" color="inherit">
              <img src="/assets/images/ic_nav_profile/ic_mess.svg" alt="ic_mess" />
            </IconButtonCustom>
            <TypoLabel>{t("header.message")}</TypoLabel>
          </MenuItemCustom>
        </Link>
        <MenuItemCustom onClick={() => handleRedirectMatching("received")}>
          <IconButtonCustom size="large" aria-label="show 17 new notifications" color="inherit">
            <img src="/assets/images/ic_nav_profile/ic_user.svg" alt="ic_user" />
          </IconButtonCustom>
          <TypoLabel>{t("header.matching-request")}</TypoLabel>
        </MenuItemCustom>
        <MenuItemCustom onClick={() => handleRedirectMatching("sent")}>
          <IconButtonCustom size="large" aria-label="show 17 new notifications" color="inherit">
            <img src="/assets/images/ic_nav_profile/ic_hand.svg" alt="ic_hand" />
          </IconButtonCustom>
          <TypoLabel>{t("header.matching-you-applied-for")}</TypoLabel>
        </MenuItemCustom>
        <MenuItemCustom onClick={() => handleRedirectMatching("favorite")}>
          <IconButtonCustom size="large" aria-label="show 17 new notifications" color="inherit">
            <img src="/assets/images/ic_nav_profile/ic_heart.svg" alt="ic_heart" />
          </IconButtonCustom>
          <TypoLabel>{t("header.list-people-you-want-to-talk")}</TypoLabel>
        </MenuItemCustom>
        <MenuItemCustom onClick={() => handleRedirectMatching("community")}>
          <IconButtonCustom size="large" aria-label="show 17 new notifications" color="inherit">
            <img src="/assets/images/ic_nav_profile/ic_star.svg" alt="ic_star" />
          </IconButtonCustom>
          <TypoLabel>{t("header.participating-community")}</TypoLabel>
        </MenuItemCustom>
        <Link href="/mail-setting" prefetch={false}>
          <MenuItemCustom>
            <IconButtonCustom size="large" aria-label="show 17 new notifications" color="inherit">
              <img src="/assets/images/ic_nav_profile/ic_setting.svg" alt="ic_setting" />
            </IconButtonCustom>
            <TypoLabel>{t("header.setting")}</TypoLabel>
          </MenuItemCustom>
        </Link>
        <MenuItemCustom onClick={handleLogout}>
          <TypoLabel>{t("header.logout")}</TypoLabel>
        </MenuItemCustom>
      </Box>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="colored"
      />
      <AppBar
        position="fixed"
        sx={{
          background: "#fff",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          p: { xs: 0, lg: "0 16px" },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: { xs: "100%", xl: "1440px" },
            margin: "auto",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/">
              <a>
                <Box
                  component="img"
                  sx={{
                    width: { xs: "70px", lg: "141px" },
                    height: { xs: "20px", lg: "42px" },
                  }}
                  alt="avatar"
                  src="/assets/images/logo/logo2.png"
                />
              </a>
            </Link>
            <Box sx={{ display: { xs: "none", lg: statusAuthPage ? "none" : "block" } }}>
              <Link href="/search_community" prefetch={false}>
                <a style={{ textDecoration: "none" }}>
                  <StyledButtonList startIcon={<img alt="" src="/assets/images/svg/users.svg" />}>
                    {t("header.list-community")}
                  </StyledButtonList>
                </a>
              </Link>
              <Link href="/search_user" prefetch={false}>
                <a style={{ textDecoration: "none" }}>
                  <StyledButtonList startIcon={<img alt="" src="/assets/images/svg/ic_computer.svg" />}>
                    {t("header.list-engineers")}
                  </StyledButtonList>
                </a>
              </Link>
            </Box>
            <Search sx={{ display: statusAuthPage ? "none" : "inherit" }}>
              <SearchIconWrapper>
                <img src="/assets/images/icon/ic_search_2.png" alt="ic_search" width="18px" height="18px" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="言語、趣味、地域"
                inputProps={{ "aria-label": "言語、趣味、地域" }}
                onKeyPress={onKeyPress}
                defaultValue={valueSearch}
              />
              <Box
                sx={{
                  width: "120px",
                  background: "#F5F5F5",
                  color: "#1A2944",
                  borderTopRightRadius: "12px",
                  borderBottomRightRadius: "12px",
                  borderLeft: "1px solid #D8D8D8",
                }}
              >
                <SelectCustom id="outlined-select-typeSearch" value={typeSearch} onChange={handleChange}>
                  {typeSearchs.map((option) => (
                    <MenuItem key={option.label} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </SelectCustom>
              </Box>
            </Search>
          </Box>
          <Box sx={{ display: statusAuthPage ? "none" : "inherit" }}>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                sx={{ p: "12px 16px" }}
                onClick={handleOpenMenuChat}
              >
                <Badge badgeContent={listRoomsChatUnread} color="error">
                  <img style={{ width: "24px", height: "20px" }} src="/assets/images/icon/ic_mess.png" alt="ic_mess" />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                sx={{ p: "12px 16px" }}
                onClick={handleNotifyOpenMenu}
              >
                <Badge badgeContent={notifications?.unread_count} color="error">
                  <img style={{ width: "24px", height: "24px" }} src="/assets/images/icon/ic_bell.png" alt="ic_bell" />
                </Badge>
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconButton
                  onClick={handleOpenMenu}
                  sx={{
                    borderRadius: "50%",
                    p: "0",
                    ml: "20px",
                    height: "100%",
                  }}
                >
                  <Avatar
                    src={auth?.profile_image || "/assets/images/svg/avatar.svg"}
                    alt={auth?.username}
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none", color: "#080B47" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                sx={{ p: "12px 16px" }}
                onClick={handleOpenMenuChat}
              >
                <Badge badgeContent={listRoomsChatUnread} color="error">
                  <img style={{ width: "24px", height: "20px" }} src="/assets/images/icon/ic_mess.png" alt="ic_mess" />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={handleNotifyOpenMenu}
              >
                <Badge badgeContent={notifications?.unread_count} color="error">
                  <img style={{ width: "24px", height: "24px" }} src="/assets/images/icon/ic_bell.png" alt="ic_bell" />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                sx={{ p: 0, ml: "33px" }}
              >
                <Avatar
                  src={auth?.profile_image || "/assets/images/svg/avatar.svg"}
                  alt={auth?.username}
                  sx={{
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
        {!statusAuthPage && (
          <Box sx={{ display: { xs: "flex", lg: "none" }, justifyContent: "center" }}>
            <Link href="/search_user" prefetch={false}>
              <a style={{ textDecoration: "none" }}>
                <StyledButtonList
                  startIcon={<img alt="" src="/assets/images/svg/ic_computer.svg" width="16px" height="11.33px" />}
                  sx={{ mr: { xs: "40px", md: "0" } }}
                >
                  {t("header.list-engineers")}
                </StyledButtonList>
              </a>
            </Link>
            <Link href="/search_community" prefetch={false}>
              <a style={{ textDecoration: "none" }}>
                <StyledButtonList
                  startIcon={<img alt="" src="/assets/images/svg/users.svg" width="15.36px" height="10.88px" />}
                >
                  {t("header.list-community")}
                </StyledButtonList>
              </a>
            </Link>
          </Box>
        )}
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <Box>{statusChatMenu && <HeaderChatComponent onClose={handleMenuChatClose} anchor={menuChatAnchorEl} />}</Box>
      <Box>
        {statusNotify && <HeaderNotificationComponent onClose={handleNotifyMenuClose} anchor={notifyAnchorEl} />}
      </Box>
    </Box>
  );
});

export default HeaderComponent;
