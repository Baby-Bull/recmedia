/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useRef } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tabs,
  Tab,
  MenuItem,
  Menu,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";

import InputCustom from "src/components/chat/ElementCustom/InputCustom";
import styles from "src/components/chat/chat.module.scss";
import { formatChatDateRoom } from "src/helpers/helper";
import theme from "src/theme";
import useDebounce from "src/customHooks/UseDebounce";
import useWindowSize from "src/customHooks/UseWindowSize";

import BlockNoDataComponent from "./NoDataComponent";

export const TabsCustom = styled(Tabs)(() => ({
  padding: 0,
  color: "black",
  fontSize: "20px",
  fontWeight: 500,
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  "& .MuiTab-root": {
    fontSize: "20px",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  "& .Mui-selected": {
    color: theme.blue,
  },
  "& .MuiTabs-indicator": {
    backgroundColor: theme.blue,
  },
}));

interface IThreadDropDownProps {
  open: boolean;
  anchorEl: any;
  handleClose: () => void;
  redirectToCommunity: () => void;
}

const ThreadDropdown: React.SFC<IThreadDropDownProps> = ({ open, anchorEl, handleClose, redirectToCommunity }) => (
  <Menu
    open={open}
    className="dropdown-option-thread"
    anchorEl={anchorEl}
    onClose={handleClose}
    keepMounted
    disablePortal
    sx={{
      top: "9px",
      left: "-7em",
      "& .MuiMenu-paper": {
        borderRadius: "12px",
      },
      ".MuiMenuItem-root": {
        fontSize: "12px",
      },
      img: {
        height: "16px",
        width: "16px",
        marginRight: "7px",
        filter: `invert(67%) sepia(61%) saturate(5498%) hue-rotate(152deg) brightness(103%) contrast(98%)`,
      },
    }}
  >
    <MenuItem onClick={redirectToCommunity}>コミュニティを見る</MenuItem>
  </Menu>
);

const ChatBoxLeftComponent = ({
  listRooms,
  communityId,
  onSelectRoom,
  setSearchChatRoom,
  hasMoreChatRoom,
  loadMoreChatRooms,
  isMobile,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const inputSearchRef = useRef(null);

  const debounce = useDebounce((value: string) => {
    setSearchChatRoom({
      search: value,
      cursor: null,
    });
  }, 500);

  const handleOnKeyUpInputSearchRef = () => {
    debounce(inputSearchRef.current.value);
  };
  const [, windowHeight] = useWindowSize();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const redirectToCommunity = (communityIdThread: string) => {
    router.push(`/community/${communityIdThread}`);
    handleClose();
  };

  return (
    <Grid item className={styles.chatBoxLeft}>
      <Box className="box-title">
        <TabsCustom value={2} aria-label="chat-tab" variant="fullWidth" sx={{ border: "1px solid #e4e6eb" }}>
          <Tab label={t("chat:box-left-title")} value={1} onClick={() => router.push("/chat/personal")} />
          <Tab label={t("chat:community-box-left-title")} value={2} />
        </TabsCustom>
      </Box>
      <Box className="box-search">
        <Paper className="input-search" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}>
          <img alt="search" src="/assets/images/svg/ic_search.svg" />
          <InputCustom
            inputRef={inputSearchRef}
            sx={{ ml: 1, flex: 1 }}
            placeholder={t("chat:box-left-input-search-placeholder")}
            inputProps={{ "aria-label": t("chat:box-left-input-search-placeholder") }}
            onChange={handleOnKeyUpInputSearchRef}
          />
        </Paper>
      </Box>
      {isMobile && listRooms?.length === 0 ? (
        <BlockNoDataComponent />
      ) : (
        <Box className="box-content">
          <ul className={styles.boxThreads}>
            <InfiniteScroll
              className={styles.listRoomsChatLeftSide}
              style={{
                height: isMobile ? `${windowHeight - 210}px` : `${windowHeight - 93.75 - 54 - 60}px`,
              }}
              dataLength={listRooms?.length || 0}
              next={loadMoreChatRooms}
              hasMore={hasMoreChatRoom}
              height={730}
              loader={
                <Box sx={{ display: "flex", py: "15px", justifyContent: "center" }}>
                  <CircularProgress sx={{ color: theme.blue }} size={30} />
                </Box>
              }
            >
              {listRooms?.map((thread, index: number) => (
                <React.Fragment key={index}>
                  <li
                    onClick={() => {
                      const newUrl = `/chat/community?room=${thread?.community?.id}`;
                      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
                      onSelectRoom(index);
                    }}
                  >
                    <div className={`thread-item ${thread?.community?.id === communityId ? "active" : ""}`}>
                      <Avatar
                        onClick={() => router.push(`/community/${thread?.community?.id}`)}
                        alt={thread?.community?.name}
                        className="avatar background"
                        src={thread?.community?.profile_image}
                        sx={{
                          ".MuiAvatar-img": {
                            objectFit:
                              thread?.community?.profile_image === "/assets/images/logo/logo.png" ? "contain" : "cover",
                          },
                        }}
                      />
                      <div className="thread-content" style={{ maxWidth: "70%" }}>
                        <div className="title-content">
                          <Typography className="name">{thread?.community?.name}</Typography>
                          <Typography className="countMember">({thread?.community?.member_count})</Typography>
                        </div>
                        <Typography
                          className="message-hide"
                          sx={{
                            color: thread?.unread_message_count > 0 ? "black!important" : "#989ea8",
                            fontWeight: thread?.unread_message_count > 0 ? "700!important" : "400",
                          }}
                        >
                          {thread?.last_message_content_type === "text"
                            ? thread?.last_chat_message_received
                            : "添付ファイル"}
                        </Typography>
                      </div>
                      <div className="thread-last-time">
                        {thread?.last_chat_message_at ? formatChatDateRoom(thread?.last_chat_message_at) : ""}
                      </div>
                      {!isMobile && (
                        <div className="more-options">
                          <IconButton onClick={handleClick} aria-label="more" aria-haspopup="true">
                            <img alt="more-options" src="/assets/images/chat/more_options.svg" />
                          </IconButton>
                          <ThreadDropdown
                            open={open}
                            handleClose={handleClose}
                            anchorEl={anchorEl}
                            redirectToCommunity={() => redirectToCommunity(thread?.id)}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                  {isMobile && (
                    <div className="more-options-SP">
                      <IconButton className="more-option-item" aria-label="more" aria-haspopup="true">
                        <img alt="more-options" src="/assets/images/chat/more_options.svg" />
                      </IconButton>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </InfiniteScroll>
          </ul>
        </Box>
      )}
    </Grid>
  );
};

export default ChatBoxLeftComponent;
