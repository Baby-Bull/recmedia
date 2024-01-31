export interface UserBasic {
  id: string;
  username: string;
  profile_image: string;
}

export interface UserSetting {
  new_message_email_notify: boolean;
  new_recommended_user_email_notify: boolean;
}

export interface User extends UserBasic {
  is_profile_edited: boolean;
  email: string;
  review_count: number;
  community_count: number;
  favorite_count: number;
  chat_room_with_unread_messages: number;
  match_request_count: number;
  match_request_rejected_count: number;
  match_request_pending_count: number;
  match_request_confirmed_count: number;
  match_application_count: number;
  match_application_rejected_count: number;
  match_application_pending_count: number;
  match_application_confirmed_count: number;
  setting: UserSetting;
  created_at: string;
  updated_at: string;
}
