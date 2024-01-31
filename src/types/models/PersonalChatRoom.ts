import { PaginatedRelationship } from "../common/Relationship";

import { ChatRoomMessageContentTypeEnum } from "./ChatMessage";
import { UserBasic } from "./User";

export interface PersonalChatRoom {
  id: string;
  last_chat_message_at?: string;
  last_chat_message_received?: string;
  last_message_content_type?: ChatRoomMessageContentTypeEnum;
  last_message_sender_id?: string;
  unread_message_count: string;
  user: UserBasic;
  chatMessages: PaginatedRelationship;
}
