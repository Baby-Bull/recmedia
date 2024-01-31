import { UserBasic } from "./User";

// eslint-disable-next-line no-shadow
export enum ChatRoomMessageContentTypeEnum {
  // eslint-disable-next-line no-unused-vars
  FirstMessage = "first-message",
  // eslint-disable-next-line no-unused-vars
  Text = "text",
  // eslint-disable-next-line no-unused-vars
  Image = "image",
  // eslint-disable-next-line no-unused-vars
  File = "file",
}

// eslint-disable-next-line no-shadow
export enum ChatRoomTypeEnum {
  // eslint-disable-next-line no-unused-vars
  Personal = "MatchUser",
  // eslint-disable-next-line no-unused-vars
  Community = "Community",
}

export interface ChatMessage {
  id: string;
  content: string;
  content_type: ChatRoomMessageContentTypeEnum;
  chat_room_id: string;
  chat_room_type: ChatRoomTypeEnum;
  created_at: string;
  user: UserBasic;
  meta?: {
    filename: string;
    size: number;
  };
}
