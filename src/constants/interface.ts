import { SearchFormStatus } from "./constants";

export interface IStoreState {
  user: any;
  notifications: any;
  listrooms: {
    itemsPersonal: Array<any>,
    itemsCommunity: Array<any>,
    hasMorePersonal: boolean,
    hasMoreCommunity: boolean,
    cursorPersonal: string,
    cursorCommunity: string,
    unread_count: number,
  };
  search_users: {
    scrollPosition: number;
    formStatus: SearchFormStatus;
    form: {
      job: string | number;
      employeeStatus: string | number;
      lastLogin: number;
      review: number;
      statusCanTalk: boolean;
      statusLookingForFriend: boolean;
      statusNeedConsult: boolean;
      tags: string[];
    };
    result: {
      limit: number;
      cursor: string;
      items: any[];
      sort: string;
      hasMore: boolean;
    };
  };
  search_community: any;
  is_profile_edited: boolean;
}