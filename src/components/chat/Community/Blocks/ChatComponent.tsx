/* eslint-disable no-console */
/* eslint-disable */
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/router";
import { Grid } from "@mui/material";
import classNames from "classnames";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import unionBy from "lodash/unionBy";

import styles from "src/components/chat/chat.module.scss";
import useViewport from "src/helpers/useViewport";
import { getListChatRoomsCommunity } from "src/services/chat";
import { REACT_QUERY_KEYS } from "src/constants/constants";
import { sortListRoomChat } from "src/helpers/helper";
import ChatBoxLeftComponent from "src/components/chat/Community/Blocks/ChatBoxLeftComponent";
import websocket from "src/helpers/socket";
import { IStoreState } from "src/constants/interface";
import actionTypes from "src/store/actionTypes";

import ChatBoxRightComponent from "./ChatBoxRightComponent";
import ChatBoxRightNoDataComponent from "./ChatBoxRightNoDataComponent";
import { readMessageCommunity } from "src/services/user";
import { getCommunity } from "src/services/community";

const BlockChatComponent = ({ isRenderRightSide, setIsRenderRightSide }) => {
  const router = useRouter();
  const { room: roomQuery } = router.query;
  // Responsive
  const viewPort = useViewport();
  const isMobile = viewPort.width <= 992;
  const dispatch = useDispatch();
  const listRoomsChatTemp = useSelector((state: IStoreState) => state.listrooms.itemsCommunity);
  const listRoomsChatCursor = useSelector((state: IStoreState) => state.listrooms.cursorCommunity);
  const hasMoreChatRooms = useSelector((state: IStoreState) => state.listrooms.hasMoreCommunity);

  const [communityId, setCommunityId] = useState(roomQuery);
  const [roomSelect, setRoomSelect] = useState(null);

  const [newMessageOfRoom, setNewMessageOfRoom] = useState(null);

  // Search chat-room
  const [searchChatRoom, setSearchChatRoom] = useState({
    search: null,
    cursor: null,
  });
  const { refetch: fetchChatrooms } = useQuery(
    [`${REACT_QUERY_KEYS.LIST_ROOMS}/community`, searchChatRoom.search, searchChatRoom.cursor],
    async () => {
      const communityChatRoomTemp = await getListChatRoomsCommunity(searchChatRoom?.search, searchChatRoom?.cursor, 12);
      const updatedList = searchChatRoom?.cursor
        ? sortListRoomChat(unionBy(communityChatRoomTemp.items, listRoomsChatTemp, "id"))
        : communityChatRoomTemp.items;
      dispatch({
        type: actionTypes.UPDATE_LIST_COMMUNITY_CHAT_ROOMS,
        payload: {
          items: updatedList,
          hasMore: communityChatRoomTemp.hasMore,
          cursor: communityChatRoomTemp.cursor,
        },
      });
      return { hasLoaded: true };
    },
    { refetchOnWindowFocus: false, keepPreviousData: true, enabled: false },
  );

  const updateLastMessageOfListRooms = useCallback(
    async (message: any) => {
      let tempList = [...listRoomsChatTemp];
      const chatroomIndex = tempList.findIndex((room) => room.id === message.chat_room_id);
      if (chatroomIndex > -1) {
        // chatroom exists -- only chatrooms that loaded from store (20 chatrooms)
        tempList[chatroomIndex] = {
          ...tempList[chatroomIndex],
          last_chat_message_at: message.created_at,
          last_chat_message_received: message.content,
          last_message_content_type: message.content_type,
        };
      } else {
        tempList = [
          {
            id: message.chat_room_id,
            user: message?.user || {},
            community: message?.community || {},
            last_chat_message_at: message.created_at,
            last_chat_message_received: message.content,
          },
          ...tempList,
        ];
      }
      const listRoomTemp = sortListRoomChat(tempList);
      dispatch({
        type: actionTypes.UPDATE_LIST_COMMUNITY_CHAT_ROOMS,
        payload: {
          items: listRoomTemp,
        },
      });
      if (roomSelect?.id === message.chat_room_id) {
        await readMessageCommunity(roomSelect.id);
        dispatch({
          type: actionTypes.UPDATE_COMMUNITY_CHATROOM_UNREAD_COUNT,
          payload: { chatRoomId: message.chat_room_id, count: 0 },
        });
      }
    },
    [listRoomsChatTemp, roomSelect?.id],
  );

  useEffect(() => {
    const wsHandler = (message) => {
      if (roomSelect?.id === message.chat_room_id) {
        setNewMessageOfRoom(message);
      }

      updateLastMessageOfListRooms(message);
    };

    const handleUpdatePersonalChatroomUnreadMessages = ({
      chat_room_id: chatRoomId,
      chat_message_unread_count: count,
    }) => {
      if (roomSelect?.id !== chatRoomId) {
        dispatch({
          type: actionTypes.UPDATE_COMMUNITY_CHATROOM_UNREAD_COUNT,
          payload: { chatRoomId, count },
        });
      }
    };

    websocket.on("get.community.chatRoom.message", wsHandler);
    websocket.on(`chatRoom.community.new_unread`, handleUpdatePersonalChatroomUnreadMessages);
    return () => {
      websocket.off("get.community.chatRoom.message", wsHandler);
      websocket.off(`chatRoom.community.new_unread`, handleUpdatePersonalChatroomUnreadMessages);
    };
  }, [roomSelect?.id, updateLastMessageOfListRooms]);

  // useEffect(() => {
  //   const listRoomSort = sortListRoomChat(listRoomResQuery?.items || []);
  //   setListRooms(
  //     listRoomSort?.map((room) => ({
  //       ...room,
  //       community: {
  //         ...room?.community,
  //         profile_image: room?.community?.profile_image || "/assets/images/logo/logo.png",
  //       },
  //     })),
  //   );
  // }, [listRoomResQuery]);

  useLayoutEffect(() => {
    const checkCommuExistFn = async () => {
      if (viewPort.width) {
        let selectedRoom = roomSelect;
        let tempCommunityResult;

        const checkInListChatroom = listRoomsChatTemp?.findIndex((room) => room.id === communityId);
        if (checkInListChatroom > -1) {
          selectedRoom = listRoomsChatTemp?.find((room) => room.id === communityId);
        } else {
          if (communityId) {
            tempCommunityResult = await getCommunity(communityId);
            if (tempCommunityResult) {
              selectedRoom = {
                community: {
                  id: tempCommunityResult?.id,
                  member_count: tempCommunityResult?.member_count,
                  name: tempCommunityResult?.name,
                  profile_image: tempCommunityResult?.profile_image,
                },
                id: tempCommunityResult?.id
              }
            }
          }
        }

        if (selectedRoom) {
          //if (isMobile) setIsRenderRightSide(true);
          setRoomSelect(selectedRoom);
          setCommunityId(selectedRoom?.id);
        }
        // else if (!isMobile) {
        else {
          setRoomSelect(listRoomsChatTemp?.[0] || {});
          setCommunityId(listRoomsChatTemp?.[0]?.community?.id);
        }
      }
    }
    checkCommuExistFn();
  }, [listRoomsChatTemp, viewPort, communityId]);

  useEffect(() => {
    fetchChatrooms();
  }, [searchChatRoom])

  const loadMoreMessageCommunity = () => {
    setSearchChatRoom((currentState) => ({
      ...currentState,
      cursor: listRoomsChatCursor,
    }));
  };

  const sendMessage = (message: string, type: string = "text", fileName: string = "", fileSize: any = "") => {
    if (message) {
      const payload = {
        chatRoomId: roomSelect?.id,
        content: message,
        content_type: type,
        meta: {
          filename: fileName,
          size: fileSize,
        },
      };
      websocket.emit("community.chatRoom.message", payload);
      updateLastMessageOfListRooms({
        community: roomSelect?.community,
        content: message,
        chat_room_id: roomSelect?.id,
        content_type: type,
        created_at: new Date().toISOString(),
        meta: {
          filename: fileName,
          size: fileSize,
        },
      });
    }
  };
  const onSelectRoom = async (index: number) => {
    if (isMobile) setIsRenderRightSide(!isRenderRightSide);
    if (listRoomsChatTemp[index]?.community?.id !== communityId) {
      setRoomSelect(listRoomsChatTemp[index]);
      setCommunityId(listRoomsChatTemp[index]?.community?.id);
    }
    if (listRoomsChatTemp[index]?.unread_message_count > 0) {
      await readMessageCommunity(listRoomsChatTemp[index].id);
      dispatch({
        type: actionTypes.UPDATE_COMMUNITY_CHATROOM_UNREAD_COUNT,
        payload: { chatRoomId: listRoomsChatTemp[index].id, count: 0 },
      });
    }
  };

  const toggleRenderSide = () => setIsRenderRightSide(!isRenderRightSide);

  return (
    <Grid container className={classNames(styles.chatContainerPC)}>
      {!isMobile || (isMobile && !isRenderRightSide) ? (
        <ChatBoxLeftComponent
          listRooms={listRoomsChatTemp}
          communityId={communityId}
          onSelectRoom={onSelectRoom}
          setSearchChatRoom={setSearchChatRoom}
          hasMoreChatRoom={hasMoreChatRooms}
          loadMoreChatRooms={loadMoreMessageCommunity}
          isMobile={isMobile}
        />
      ) : null}
      {(!listRoomsChatTemp?.length && !isMobile) && <ChatBoxRightNoDataComponent />}
      {listRoomsChatTemp?.length && (!isMobile || (isMobile && isRenderRightSide)) ? (
        <ChatBoxRightComponent
          isMobile={isMobile}
          toggleRenderSide={toggleRenderSide}
          communityId={communityId}
          roomSelect={roomSelect}
          sendMessage={sendMessage}
          newMessageOfRoom={newMessageOfRoom}
        />
      ) : null}
    </Grid>
  );
};

export default BlockChatComponent;
