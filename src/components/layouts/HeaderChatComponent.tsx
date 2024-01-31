/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useRef, useState, useCallback, FC } from "react";
import { connect } from "react-redux";
import unionBy from "lodash/unionBy";
import { useQuery } from "react-query";
import Menu from "@mui/material/Menu";
import InfiniteScroll from "react-infinite-scroll-component";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/styles";
import { useRouter } from "next/router";

import theme from "src/theme";
import styles from "src/components/layouts/layout.module.scss";
import actionTypes from "src/store/actionTypes";
import { MODE_ROOM_CHAT, REACT_QUERY_KEYS } from "src/constants/constants";
import { getListChatRooms, getListChatRoomsCommunity } from "src/services/chat";
import { formatChatDateRoom, sortListRoomChat } from "src/helpers/helper";
import websocket from "src/helpers/socket";
import { ChatMessage } from "src/types/models/ChatMessage";
import { readMessageCommunity, readMessagePersonal } from "src/services/user";
import useDebounce from "src/customHooks/UseDebounce";

import InputCustom from "../chat/ElementCustom/InputCustom";

const TabsCustom = styled(TabList)(() => ({
  padding: 0,
  color: "black",
  fontSize: "20px",
  fontWeight: 500,

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

type Props = {
  personalChatRooms: any[];
  communityChatRooms: any[];
  hasMorePersonalChatRooms: boolean;
  hasMoreCommunityChatRooms: boolean;
  cursorPersonalChatRoom?: string;
  cursorCommunityChatRoom?: string;
  anchor: any;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  updatePersonalChatRoomList: (payload: any) => void;
  // eslint-disable-next-line no-unused-vars
  updateCommunityChatRoomList: (payload: any) => void;
  // eslint-disable-next-line no-unused-vars
  updatePersonalChatRoomCount: ({ chatRoomId, count }: { chatRoomId: string; count: number }) => void;
  // eslint-disable-next-line no-unused-vars
  updateCommunityChatRoomCount: ({ chatRoomId, count }: { chatRoomId: string; count: number }) => void;
};

const HeaderChatComponent: FC<Props> = ({
  anchor,
  personalChatRooms = [],
  communityChatRooms = [],
  hasMorePersonalChatRooms = false,
  hasMoreCommunityChatRooms = false,
  cursorPersonalChatRoom = "",
  cursorCommunityChatRoom = "",
  updatePersonalChatRoomList,
  updateCommunityChatRoomList,
  updatePersonalChatRoomCount,
  updateCommunityChatRoomCount,
  onClose,
}) => {
  const router = useRouter();
  const inputSearchMenuChatPersonal = useRef(null);
  const inputSearchMenuChatCommunity = useRef(null);
  const [searchChatRoomPersonal, setSearchChatRoomPersonal] = useState({
    search: null,
    cursor: null,
  });
  const [searchChatRoomCommunity, setSearchChatRoomCommunity] = useState({
    search: null,
    cursor: null,
  });
  const [valueTabChatMessage, setValueTabChatMessage] = React.useState("1");
  const handleChangeTabMessage = (event, newValue) => {
    setValueTabChatMessage(newValue);
  };

  const debounceSearchRooms = useDebounce((searchValue: string, mode: string) => {
    switch (mode) {
      case MODE_ROOM_CHAT.community:
        setSearchChatRoomCommunity({
          search: searchValue,
          cursor: null,
        });
        break;

      default:
        setSearchChatRoomPersonal({
          search: searchValue,
          cursor: null,
        });
        break;
    }
  }, 500);

  const handleTypingForInputSearch = (valueInputSearchTemp: any, mode: string) => {
    debounceSearchRooms(valueInputSearchTemp, mode);
  };
  useQuery(
    [`${REACT_QUERY_KEYS.LIST_ROOMS}/personal`, searchChatRoomPersonal.cursor, searchChatRoomPersonal.search],
    async () => {
      const personalChatRoomTemp = await getListChatRooms(
        searchChatRoomPersonal?.search,
        searchChatRoomPersonal?.cursor,
        10,
      );
      const updatedList = searchChatRoomPersonal?.cursor
        ? sortListRoomChat(unionBy(personalChatRoomTemp.items, personalChatRooms, "id"))
        : personalChatRoomTemp.items;

      updatePersonalChatRoomList({
        items: updatedList,
        hasMore: personalChatRoomTemp.hasMore,
        cursor: personalChatRoomTemp.cursor,
      });
    },
    { refetchOnWindowFocus: false, keepPreviousData: true },
  );

  useQuery(
    [`${REACT_QUERY_KEYS.LIST_ROOMS}/community`, searchChatRoomCommunity.cursor, searchChatRoomCommunity.search],
    async () => {
      const communityChatRoomTemp = await getListChatRoomsCommunity(
        searchChatRoomCommunity?.search,
        searchChatRoomCommunity?.cursor,
        10,
      );
      const updatedList = searchChatRoomCommunity?.cursor
        ? sortListRoomChat(unionBy(communityChatRoomTemp.items, communityChatRooms, "id"))
        : communityChatRoomTemp.items;
      updateCommunityChatRoomList({
        items: updatedList,
        hasMore: communityChatRoomTemp.hasMore,
        cursor: communityChatRoomTemp.cursor,
      });
    },
    { refetchOnWindowFocus: false, keepPreviousData: true },
  );

  const updateLastMessageOfListRooms = useCallback(
    async (message: any) => {
      let sourceRoomsTemp = message?.community ? [...communityChatRooms] : [...personalChatRooms];
      const chatroomIndex = sourceRoomsTemp.findIndex((room) => room.id === message.chat_room_id);
      if (chatroomIndex > -1) {
        // chatroom exists
        sourceRoomsTemp[chatroomIndex] = {
          ...sourceRoomsTemp[chatroomIndex],
          last_chat_message_at: message.created_at,
          last_chat_message_received: message.content,
          last_message_content_type: message.content_type,
        };
      } else {
        sourceRoomsTemp = [
          {
            id: message.chat_room_id,
            user: message?.user || {},
            community: message?.community || {},
            last_chat_message_at: message.created_at,
            last_chat_message_received: message.content,
          },
          ...sourceRoomsTemp,
        ];
      }
      const listRoomTemp = sortListRoomChat(sourceRoomsTemp);
      if (message?.community) {
        updateCommunityChatRoomList({
          items: listRoomTemp,
        });
      } else {
        updatePersonalChatRoomList({
          items: listRoomTemp,
        });
      }
    },
    [communityChatRooms, personalChatRooms],
  );

  const loadMoreMessagePersonal = () => {
    setSearchChatRoomPersonal((currentState) => ({
      ...currentState,
      cursor: cursorPersonalChatRoom,
    }));
  };

  const loadMoreMessageCommunity = () => {
    setSearchChatRoomCommunity((currentState) => ({
      ...currentState,
      cursor: cursorCommunityChatRoom,
    }));
  };

  const handleClickPersonalChatroom = async (chatroom: any) => {
    if (chatroom.unread_message_count > 0)
      readMessagePersonal(chatroom.user.id).then(() =>
        updatePersonalChatRoomCount({ chatRoomId: chatroom.id, count: 0 }),
      );
    router.push(
      {
        pathname: "/chat/personal",
        query: { room: chatroom.user.id },
      },
      undefined,
      { shallow: false },
    );
  };

  const handleClickCommunityChatRoom = async (chatroom: any) => {
    if (chatroom.unread_message_count > 0)
      readMessageCommunity(chatroom.community.id).then(() =>
        updateCommunityChatRoomCount({ chatRoomId: chatroom.id, count: 0 }),
      );
    router.push(
      {
        pathname: "/chat/community",
        query: { room: chatroom.community.id },
      },
      undefined,
      { shallow: false },
    );
  };

  useEffect(() => {
    const handleNewMessage = (message: ChatMessage) => {
      updateLastMessageOfListRooms(message);
    };
    const handleUpdatePersonalChatroomUnreadMessages = ({
      chat_room_id: chatRoomId,
      chat_message_unread_count: count,
    }) => {
      updatePersonalChatRoomCount({ chatRoomId, count });
    };
    const handleUpdateCommunityChatroomUnreadMessages = ({
      chat_room_id: chatRoomId,
      chat_message_unread_count: count,
    }) => {
      updateCommunityChatRoomCount({ chatRoomId, count });
    };
    websocket.on(`get.chatRoom.message`, handleNewMessage);
    websocket.on(`chatRoom.personal.new_unread`, handleUpdatePersonalChatroomUnreadMessages);
    websocket.on(`chatRoom.community.new_unread`, handleUpdateCommunityChatroomUnreadMessages);
    websocket.on(`get.community.chatRoom.message`, handleNewMessage);
    return () => {
      websocket.off("get.chatRoom.message", handleNewMessage);
      websocket.off(`chatRoom.personal.new_unread`, handleUpdatePersonalChatroomUnreadMessages);
      websocket.off(`chatRoom.community.new_unread`, handleUpdateCommunityChatroomUnreadMessages);
      websocket.off("get.community.chatRoom.message", handleNewMessage);
    };
  }, [updateLastMessageOfListRooms, updatePersonalChatRoomCount, updateCommunityChatRoomCount]);

  return (
    <Menu
      anchorEl={anchor}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id="primary-search-account-menu-chat"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open
      onClose={onClose}
      className={styles.menuChatDropDown}
      sx={{
        zIndex: 10001,
        "& .MuiMenu-paper": {
          borderRadius: "12px",
          height: "40em",
          overflowY: "hidden",
        },
      }}
    >
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={valueTabChatMessage}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              position: "sticky",
              top: "0",
              background: "white",
              zIndex: "1",
            }}
          >
            <TabsCustom variant="fullWidth" onChange={handleChangeTabMessage}>
              <Tab label="メッセージ" value="1" />
              <Tab label="グループチャット" value="2" />
            </TabsCustom>
          </Box>
          <TabPanel sx={{ padding: "0", width: "365px" }} value="1">
            <Box className={styles.boxSearch}>
              <Paper
                className={styles.inputSearch}
                sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}
              >
                <img alt="search" src="/assets/images/svg/ic_search.svg" />
                <InputCustom
                  inputRef={inputSearchMenuChatPersonal}
                  sx={{ ml: 1, flex: 1 }}
                  // placeholder={t("chat:box-left-input-search-placeholder")}
                  // inputProps={{ "aria-label": t("chat:box-left-input-search-placeholder") }}
                  placeholder="アカウントを検索"
                  inputProps={{ "aria-label": "アカウントを検索" }}
                  onInput={() =>
                    handleTypingForInputSearch(inputSearchMenuChatPersonal.current.value, MODE_ROOM_CHAT.personal)
                  }
                />
              </Paper>
            </Box>
            <Box className="box-content">
              <ul className={styles.boxThreads}>
                <InfiniteScroll
                  className={styles.listChatRooms}
                  dataLength={personalChatRooms.length || 0}
                  next={loadMoreMessagePersonal}
                  hasMore={hasMorePersonalChatRooms}
                  height={495}
                  loader={
                    <Box sx={{ display: "flex", py: "15px", justifyContent: "center" }}>
                      <CircularProgress sx={{ color: theme.blue }} size={30} />
                    </Box>
                  }
                >
                  {personalChatRooms.length ? (
                    personalChatRooms.map((thread, index: number) => (
                      <React.Fragment key={index}>
                        <li onClick={() => handleClickPersonalChatroom(thread)}>
                          <div className={`thread-item ${thread?.user?.id === "userId" ? "active" : ""}`}>
                            <div className="avatar">
                              <Avatar
                                alt={thread?.user?.username}
                                src={thread?.user?.profile_image || "/assets/images/svg/avatar.svg"}
                                sx={{ width: "50px", height: "50px", mr: "13px" }}
                              />
                            </div>
                            <div className="thread-content">
                              <Typography className="name">{thread?.user?.username}</Typography>
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
                            <div className="thread-last-time">{formatChatDateRoom(thread?.last_chat_message_at)}</div>
                            {/* {!isMobile && (
                                <div className="more-options">
                                  <IconButton onClick={handleClick} aria-label="more" aria-haspopup="true">
                                    <img alt="more-options" src="/assets/images/chat/more_options.svg" />
                                  </IconButton>
                                  <ThreadDropdown
                                    open={open}
                                    handleClose={handleClose}
                                    setShowPopupReport={setShowPopupReport}
                                    setShowPopupReview={setShowPopupReview}
                                    anchorEl={anchorEl}
                                    redirectToProfile={redirectToProfile}
                                  />
                                </div>
                              )} */}
                          </div>
                        </li>
                        {/* {isMobile && (
                            <div className="more-options-SP">
                              <IconButton
                                onClick={(event: React.MouseEvent<HTMLElement>) => {
                                  handleClick(event);
                                  transferUserToLeftMobile(index);
                                }}
                                aria-label="more"
                                aria-haspopup="true"
                                sx={{
                                  position: "absolute",
                                  right: "2em",
                                  marginTop: "-2.4em",
                                  height: "40px",
                                  width: "40px",
                                  background: "white",
                                  boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
                                }}
                              >
                                <img alt="more-options" src="/assets/images/chat/more_options.svg" />
                              </IconButton>
                              <ThreadDropdown
                                open={open}
                                handleClose={handleClose}
                                setShowPopupReport={setShowPopupReport}
                                setShowPopupReview={setShowPopupReview}
                                anchorEl={anchorEl}
                                redirectToProfile={redirectToProfile}
                              />
                            </div>
                          )} */}
                      </React.Fragment>
                    ))
                  ) : (
                    <Box
                      sx={{
                        width: "365px",
                        display: "flex",
                        height: "550px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <b>会話なし</b>
                    </Box>
                  )}
                </InfiniteScroll>
              </ul>
            </Box>
          </TabPanel>
          <TabPanel sx={{ padding: "0", width: "365px" }} value="2">
            <Box className={styles.boxSearch}>
              <Paper
                className={styles.inputSearch}
                sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}
              >
                <img alt="search" src="/assets/images/svg/ic_search.svg" />
                <InputCustom
                  inputRef={inputSearchMenuChatCommunity}
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="アカウントを検索"
                  inputProps={{ "aria-label": "アカウントを検索" }}
                  onKeyUp={() =>
                    handleTypingForInputSearch(inputSearchMenuChatCommunity.current.value, MODE_ROOM_CHAT.community)
                  }
                />
              </Paper>
            </Box>
            <Box className="box-content">
              <ul className={styles.boxThreads}>
                <InfiniteScroll
                  dataLength={communityChatRooms.length || 0}
                  next={loadMoreMessageCommunity}
                  hasMore={hasMoreCommunityChatRooms}
                  height={495}
                  loader={
                    <Box sx={{ display: "flex", py: "15px", justifyContent: "center" }}>
                      <CircularProgress sx={{ color: theme.blue }} size={30} />
                    </Box>
                  }
                >
                  {communityChatRooms.length ? (
                    communityChatRooms.map((thread, index: number) => (
                      <React.Fragment key={index}>
                        <li onClick={() => handleClickCommunityChatRoom(thread)}>
                          <div className={`thread-item ${thread?.community?.id === "communityId" ? "active" : ""}`}>
                            <div
                              className="avatar background"
                              style={{
                                backgroundImage: `url(${thread?.community?.profile_image})`,
                              }}
                            />
                            <div className="thread-content" style={{ maxWidth: "70%" }}>
                              <Typography className="name">
                                {thread?.community?.name}({thread?.community?.member_count})
                              </Typography>
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
                            {/* {!isMobile && (
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
                              )} */}
                          </div>
                        </li>
                        {/* {isMobile && (
                            <div className="more-options-SP">
                              <IconButton
                                aria-label="more"
                                aria-haspopup="true"
                                sx={{
                                  position: "absolute",
                                  right: "2em",
                                  marginTop: "-2.4em",
                                  height: "40px",
                                  width: "40px",
                                  background: "white",
                                  boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
                                }}
                              >
                                <img alt="more-options" src="/assets/images/chat/more_options.svg" />
                              </IconButton>
                            </div>
                          )} */}
                      </React.Fragment>
                    ))
                  ) : (
                    <Box
                      sx={{
                        width: "365px",
                        display: "flex",
                        height: "550px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <b>会話なし</b>
                    </Box>
                  )}
                </InfiniteScroll>
              </ul>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Menu>
  );
};

export default connect(
  (state: any, ownProps: any) => ({
    anchor: ownProps.anchor,
    personalChatRooms: state.listrooms.itemsPersonal,
    communityChatRooms: state.listrooms.itemsCommunity,
    hasMorePersonalChatRooms: state.listrooms.hasMorePersonal,
    hasMoreCommunityChatRooms: state.listrooms.hasMoreCommunity,
    cursorPersonalChatRoom: state.listrooms.cursorPersonal,
    cursorCommunityChatRoom: state.listrooms.cursorCommunity,
  }),
  (dispatch, ownProps: any) => ({
    onClose: ownProps.onClose,
    updatePersonalChatRoomList: (payload: any) =>
      dispatch({ type: actionTypes.UPDATE_LIST_PERSONAL_CHAT_ROOMS, payload }),
    updateCommunityChatRoomList: (payload: any) =>
      dispatch({ type: actionTypes.UPDATE_LIST_COMMUNITY_CHAT_ROOMS, payload }),
    updatePersonalChatRoomCount: ({ chatRoomId, count }: { chatRoomId: string; count: number }) =>
      dispatch({ type: actionTypes.UPDATE_PERSONAL_CHATROOM_UNREAD_COUNT, payload: { chatRoomId, count } }),
    updateCommunityChatRoomCount: ({ chatRoomId, count }: { chatRoomId: string; count: number }) =>
      dispatch({ type: actionTypes.UPDATE_COMMUNITY_CHATROOM_UNREAD_COUNT, payload: { chatRoomId, count } }),
    updateTotalChatroomUnreadCount: (count: number) =>
      dispatch({ type: actionTypes.UPDATE_UNREAD_LISTROOMS_COUNT, payload: { count } }),
  }),
)(HeaderChatComponent);
