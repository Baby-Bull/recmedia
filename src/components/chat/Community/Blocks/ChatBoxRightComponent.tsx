/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import InfiniteScroll from "react-infinite-scroller";
import { useQuery } from "react-query";
import Linkify from "react-linkify";
import { useSelector } from "react-redux";
import Lightbox from "react-image-lightbox";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

import styles from "src/components/chat/chat.module.scss";
import InputCustom from "src/components/chat/ElementCustom/InputCustom";
import scrollEl from "src/helpers/scrollEl";
import { getMessagesCommunity, uploadFile } from "src/services/chat";
import { formatChatDate, formatListMessages } from "src/helpers/helper";
import { MESSAGE_CONTENT_TYPES, REACT_QUERY_KEYS } from "src/constants/constants";
import { IStoreState } from "src/constants/interface";
import "react-image-lightbox/style.css";
import useWindowSize from "src/customHooks/UseWindowSize";

interface IBoxChatProps {
  avatar?: string;
  message: any;
  time: string;
  showAvatar: boolean;
  userId: string;
}
interface IBoxMyChatProps {
  message: any;
  time: string;
  isStartOfDay?: boolean;
  isErrorMessage?: boolean;
}

interface INameOfChatSPProps {
  name: string;
  handleClick: () => void;
}

interface IThreadDropDownProps {
  open: boolean;
  anchorEl: any;
  handleClose: () => void;
}

const ThreadDropdown: React.SFC<IThreadDropDownProps> = ({ open, handleClose, anchorEl }) => (
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
        fontSize: "10px",
      },
    }}
  >
    <MenuItem onClick={handleClose}>メッセージの編集</MenuItem>
    <MenuItem onClick={handleClose}>メッセージを削除する</MenuItem>
  </Menu>
);

const BoxMyChat: React.SFC<IBoxMyChatProps> = ({ message, time, isStartOfDay = false, isErrorMessage = false }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showOptionMessage, setShowOptionMessage] = useState(false);
  const open = Boolean(anchorEl);
  const [openPopupImage, setOpenPopupImage] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setShowOptionMessage(false);
  };
  return (
    <React.Fragment>
      {isStartOfDay ? (
        <div className={styles.spanStartOfDay}>
          <span>今日</span>
        </div>
      ) : null}
      <Box className={styles.itemMessageMyChat}>
        <IconButton
          sx={{
            display: showOptionMessage ? "block" : "none",
          }}
          onClick={handleClick}
          aria-label="more"
          aria-haspopup="true"
        >
          <img alt="more-options" src="/assets/images/chat/more_options.svg" />
        </IconButton>
        <ThreadDropdown open={open} anchorEl={anchorEl} handleClose={handleClose} />
        <Typography className="time">{time}</Typography>
        {message?.content_type === "text" && (
          <div
            className={`message-content ${isErrorMessage ? "error-message" : ""}`}
            onClick={() => setShowOptionMessage(!showOptionMessage)}
          >
            <Linkify>{message?.content}</Linkify>
          </div>
        )}
        {message?.content_type === "image" && (
          <Avatar
            src={message?.content}
            variant="square"
            sx={{ width: "200px", height: "200px", cursor: "pointer" }}
            onClick={() => setOpenPopupImage(true)}
          />
        )}
        {openPopupImage && <Lightbox mainSrc={message?.content} onCloseRequest={() => setOpenPopupImage(false)} />}
        {message?.content_type === "file" && (
          <Box
            sx={{
              width: "200px",
              height: "80px",
              cursor: "pointer",
              backgroundColor: "#ccc",
              padding: "10px",
              borderRadius: "10px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar
              src="/assets/images/icon/icon_file.jpg"
              variant="square"
              sx={{ width: "30px", height: "30px", cursor: "pointer", mr: "10px" }}
            />
            <Box>
              <a href={message?.content} download className={styles.tagDownload}>
                <Box className={styles.boxChatFile}>
                  <Box>{message?.meta?.filename}</Box>
                </Box>
                <Box>{((message?.meta?.size ?? 0) / 1024).toFixed(2)} kb</Box>
              </a>
            </Box>
          </Box>
        )}
      </Box>
      {/* {isErrorMessage ? ( */}
      {/*  <div className={styles.errorMessage}> */}
      {/*    <div className="span-error-message">{t("chat:span-error-message")}</div> */}
      {/*    <div className="div-btn-action"> */}
      {/*      <a type="button" className="btn-action btn-resend" onClick={() => resendMessage(message, id)}> */}
      {/*        {t("chat:btn-resend")} */}
      {/*      </a> */}
      {/*      <a type="button" className="btn-action btn-delete" onClick={() => deleteErrorMessage(id)}> */}
      {/*        {t("chat:btn-delete")} */}
      {/*      </a> */}
      {/*    </div> */}
      {/*  </div> */}
      {/* ) : null} */}
    </React.Fragment>
  );
};

const BoxChatOthers: React.SFC<IBoxChatProps> = ({ avatar, message, time, showAvatar, userId }) => {
  const [openPopupImage, setOpenPopupImage] = useState(false);
  const router = useRouter();
  const redirectProfile = () => {
    router.push(`${process.env.NEXT_PUBLIC_URL_PROFILE}/profile/${userId}`);
  };
  return (
    <Box className={styles.itemMsgOther}>
      {showAvatar ? (
        <Avatar className="avatar" alt="Avatar" src={avatar} onClick={redirectProfile} sx={{ cursor: "pointer" }} />
      ) : (
        <div className="avatar" />
      )}
      {message?.content_type === "text" && (
        <div className="message-content">
          <Linkify>{message?.content}</Linkify>
        </div>
      )}

      {message?.content_type === "image" && (
        <Avatar
          src={message?.content}
          variant="square"
          sx={{ width: "200px", height: "200px", cursor: "pointer" }}
          onClick={() => setOpenPopupImage(true)}
        />
      )}
      {openPopupImage && <Lightbox mainSrc={message?.content} onCloseRequest={() => setOpenPopupImage(false)} />}
      {message?.content_type === "file" && (
        <Box
          sx={{
            width: "200px",
            height: "80px",
            cursor: "pointer",
            backgroundColor: "#ccc",
            padding: "10px",
            borderRadius: "10px",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            src="/assets/images/icon/icon_file.jpg"
            variant="square"
            sx={{ width: "30px", height: "30px", cursor: "pointer", mr: "10px" }}
          />
          <Box>
            <a href={message?.content} download className={styles.tagDownload}>
              <Box className={styles.boxChatFile}>
                <Box>{message?.meta?.filename}</Box>
              </Box>
              <Box>{((message?.meta?.size ?? 0) / 1024).toFixed(2)} kb</Box>
            </a>
          </Box>
        </Box>
      )}
      <Typography className="time">{time}</Typography>
    </Box>
  );
};

const NameOfChatSP: React.SFC<INameOfChatSPProps> = ({ name, handleClick }) => (
  <React.Fragment>
    <IconButton onClick={handleClick} sx={{ paddingLeft: 0, paddingRight: "20px" }}>
      <img alt="back" src="/assets/images/chat/ic_back.svg" width={6} />
    </IconButton>
    {name}
  </React.Fragment>
);

interface IThreadShowMessErrProps {
  open: boolean;
  handleClose: () => void;
  textMessageErr?: string;
}

const PopupShowMassageErr: React.SFC<IThreadShowMessErrProps> = ({ open, handleClose, textMessageErr }) => (
  <Dialog onClose={handleClose} open={open}>
    <Box sx={{ p: 5 }}>{textMessageErr}</Box>
  </Dialog>
);

const ChatBoxRightComponent = ({
  isMobile,
  toggleRenderSide,
  communityId,
  roomSelect,
  sendMessage,
  newMessageOfRoom,
}) => {
  const { t } = useTranslation();
  const inputChatRef = useRef(null);
  const boxMessageRef = useRef(null);
  const isFirstRender = useRef(true);
  const [sendFile, setSendFile] = useState(false);
  const [showPopupErr, setShowPopupErr] = useState(false);
  const [textMessageErr, setTextMessageErr] = useState("");
  const [listMessages, setListMessages] = useState([]);
  const [listMessagesShow, setListMessagesShow] = useState([]);

  const [hasMoreParams, setHasMoreParams] = useState({
    cursor: null,
    hasMore: false,
  });

  const [, windowHeight] = useWindowSize();
  const auth = useSelector((state: IStoreState) => state.user);

  const { data: listMessageResQuery } = useQuery(
    [REACT_QUERY_KEYS.COMMUNITY_CHAT.LIST_MESSAGES, communityId],
    async () => {
      const res = await getMessagesCommunity(communityId);
      return {
        ...res,
        items: res?.items?.reverse() || [],
      };
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!communityId,
    },
  );

  useEffect(() => {
    setListMessages([]);
    setHasMoreParams({
      cursor: null,
      hasMore: false,
    });
    setListMessages(listMessageResQuery?.items || []);
    setHasMoreParams({
      cursor: listMessageResQuery?.cursor,
      hasMore: listMessageResQuery?.hasMore,
    });
    isFirstRender.current = true;
    // inputChatRef.current.focus();

    setTimeout(() => {
      scrollEl(boxMessageRef.current);
    }, 0);
  }, [listMessageResQuery]);

  const loadMoreData = async () => {
    if (hasMoreParams?.cursor?.length && listMessages.length) {
      const res = await getMessagesCommunity(communityId, hasMoreParams?.cursor);
      setListMessages([...(res?.items?.reverse() || []), ...listMessages]);
      setHasMoreParams({
        cursor: res?.cursor,
        hasMore: res?.hasMore,
      });
      isFirstRender.current = false;
    }
  };

  useEffect(() => {
    if (newMessageOfRoom && newMessageOfRoom?.chat_room_id === roomSelect.id) {
      setListMessages([...listMessages, newMessageOfRoom]);
      setTimeout(() => {
        scrollEl(boxMessageRef.current);
      }, 300);
    }
  }, [newMessageOfRoom]);

  useEffect(() => {
    const listMessagesFormat = formatListMessages(listMessages);
    setListMessagesShow(listMessagesFormat);
  }, [listMessages]);

  const handleSendTextMessage = () => {
    const message = inputChatRef.current.value.trim();
    if (message) {
      sendMessage(message);
      setListMessages([
        ...listMessages,
        {
          id: uuidv4(),
          content: message,
          content_type: MESSAGE_CONTENT_TYPES.TEXT,
          created_at: new Date().toISOString(),
          user: {
            id: auth?.id,
          },
          isErrorMessage: !navigator.onLine,
        },
      ]);
      setTimeout(() => {
        scrollEl(boxMessageRef.current);
      }, 300);
      inputChatRef.current.value = "";
    }
  };

  const onKeyUpMessageText = (e) => {
    // composition of IME. fix bug on safari for japanese IME
    if (e.isComposing || e.keyCode === 229) {
      return;
    }
    if (!isMobile && !e.shiftKey && e.keyCode === 13 && e.target.value) {
      e.preventDefault();
      handleSendTextMessage();
    }
  };

  const scrollUp = useCallback(
    async (e) => {
      const heightScroll = boxMessageRef?.current?.scrollHeight;
      if (e.target.scrollTop === 0 && hasMoreParams?.cursor?.length && listMessages.length) {
        const res = await getMessagesCommunity(communityId, hasMoreParams?.cursor);
        setListMessages([...(res?.items?.reverse() || []), ...listMessages]);
        setHasMoreParams({
          cursor: res?.cursor,
          hasMore: res?.hasMore,
        });
        const currentHeight = boxMessageRef?.current?.scrollHeight;
        boxMessageRef?.current?.scroll({ top: currentHeight - heightScroll, left: 0 });
      }
    },
    [listMessages, hasMoreParams],
  );

  useEffect(() => {
    boxMessageRef?.current?.addEventListener("scroll", scrollUp);

    return () => {
      boxMessageRef?.current?.removeEventListener("scroll", scrollUp);
    };
  }, [listMessages, hasMoreParams]);

  const sendFileOnMess = async (e) => {
    setSendFile(true);
    const file = e.currentTarget.files[0];
    if (file.size > 2097152) {
      setShowPopupErr(true);
      setTextMessageErr("2MB以下のファイルを選択してください。");
      setSendFile(false);
      return false;
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadFile(formData)
      .then((data) => {
        let contentFile = {};
        let type = MESSAGE_CONTENT_TYPES.IMAGE;
        if (data?.mimetype === "image/jpg" || data?.mimetype === "image/png" || data?.mimetype === "image/jpeg") {
          contentFile = {
            content: data?.url,
            content_type: MESSAGE_CONTENT_TYPES.IMAGE,
            created_at: new Date().toISOString(),
            id: uuidv4(),
            sender_id: "123",
            isErrorMessage: !navigator.onLine,
            user: {
              id: auth?.id,
            },
          };
          type = MESSAGE_CONTENT_TYPES.IMAGE;
        } else {
          contentFile = {
            content: data?.url,
            content_type: MESSAGE_CONTENT_TYPES.FILE,
            created_at: new Date().toISOString(),
            id: uuidv4(),
            sender_id: "123",
            isErrorMessage: !navigator.onLine,
            user: {
              id: auth?.id,
            },
            meta: {
              filename: file.name,
              size: file.size,
            },
          };
          type = MESSAGE_CONTENT_TYPES.FILE;
        }
        setListMessages([...listMessages, contentFile]);
        sendMessage(data?.url, type, file.name, file.size);
        setSendFile(false);
        setTimeout(() => {
          scrollEl(boxMessageRef.current);
        }, 200);
        return data;
      })
      .catch((err) => {
        setTimeout(() => {
          setSendFile(false);
          setShowPopupErr(true);
          setTextMessageErr("エラーが発生しました。");
        }, 2000);
        return err;
      });
    return res;
  };
  return (
    <Grid
      item
      className={styles.chatBoxRight}
      sx={{
        marginTop: isMobile ? "-80px" : "0",
      }}
    >
      <Box className="box-title">
        <Typography className="username">
          {isMobile ? (
            <NameOfChatSP
              name={`${roomSelect?.community?.name ?? ""}${
                roomSelect?.community?.member_count ? `(${roomSelect?.community?.member_count})` : ""
              }`}
              handleClick={toggleRenderSide}
            />
          ) : (
            `${roomSelect?.community?.name ?? ""}${
              roomSelect?.community?.member_count ? `(${roomSelect?.community?.member_count})` : ""
            }`
          )}
        </Typography>
      </Box>
      <Box className="box-content">
        <Box
          className={styles.boxData}
          id="box-message"
          ref={boxMessageRef}
          style={{
            height: isMobile ? `${windowHeight - 54 - 61}px` : `${windowHeight - 54 - 61 - 60}px`,
            display: listMessages?.length === 0 ? "flex" : "block",
            justifyContent: listMessages?.length === 0 ? "center" : "initial",
            alignItems: listMessages?.length === 0 ? "center" : "initial",
          }}
        >
          {listMessages?.length ? (
            <InfiniteScroll
              loadMore={loadMoreData}
              // hasMore={!!listMessages?.length && hasMoreParams.hasMore && !isFirstRender.current}
              hasMore={false}
              loader="読み込み中..."
              isReverse
              useWindow={false}
            >
              {Object.keys(listMessagesShow)?.map((dateText) => (
                <Box key={dateText}>
                  <div className={styles.spanStartOfDay}>
                    <span>{dateText}</span>
                  </div>
                  {listMessagesShow[dateText]?.map((message: any, index: number) =>
                    message?.user?.id === auth?.id ? (
                      <BoxMyChat
                        key={index}
                        message={message}
                        time={formatChatDate(message?.created_at)}
                        isErrorMessage={!!message?.isErrorMessage}
                      />
                    ) : (
                      <BoxChatOthers
                        key={index}
                        avatar={message?.user?.profile_image || "/assets/images/svg/avatar.svg"}
                        message={message}
                        userId={message?.user?.id}
                        time={formatChatDate(message?.created_at)}
                        showAvatar={
                          !listMessagesShow[dateText][index + 1] ||
                          listMessagesShow[dateText][index + 1]?.user?.id !== message?.user?.id
                        }
                      />
                    ),
                  )}
                </Box>
              ))}
            </InfiniteScroll>
          ) : (
            <span>{t("chat:community-no-messages-start-chat")}</span>
          )}
          <Box sx={{ display: sendFile ? "flex" : "none", justifyContent: "end" }}>
            <Box
              sx={{
                width: "200px",
                height: "200px",
                background: "#eee",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress sx={{ color: "#03BCDB" }} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={styles.boxChat}>
        <Paper className="paper-chat" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}>
          <InputCustom
            multiline
            className="input-chat"
            inputRef={inputChatRef}
            id="input_chat_text"
            sx={{ ml: 1, flex: 1 }}
            placeholder={t("chat:input-chat-placeholder")}
            inputProps={{ "aria-label": t("chat:input-chat-placeholder") }}
            onKeyDown={onKeyUpMessageText}
          />
          <input hidden id="icon-button-file" type="file" onChange={sendFileOnMess} />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions" component="span">
              <img alt="search" src="/assets/images/svg/ic_attachment.svg" />
            </IconButton>
          </label>
          <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions" onClick={handleSendTextMessage}>
            <img alt="search" src="/assets/images/svg/ic_send_message.svg" />
          </IconButton>
        </Paper>
      </Box>
      <PopupShowMassageErr
        open={showPopupErr}
        handleClose={() => setShowPopupErr(!showPopupErr)}
        textMessageErr={textMessageErr}
      />
    </Grid>
  );
};

export default ChatBoxRightComponent;
