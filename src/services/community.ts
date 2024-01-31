import { toast } from "react-toastify";

import {
  APPPROVE_MEMBER,
  BLOCK_MEMBER,
  BLOCKED_MEMBER,
  CREATE_COMMUNITY,
  DELETE_COMMUNITY,
  DELETE_POST,
  REJECT_MEMBER,
  SERVER_ERROR,
  UPDATE_COMMUNITY,
  UPDATE_POST,
  CREATE_POST,
  DELETE_COMMENT,
  CREATE_COMMENT,
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
  UPDATE_COMMENT,
  SEND_REQUEST_COMMUNITY,
} from "src/messages/notification";
import { api } from "src/helpers/api";
import { typeCountLogin, typeCountMember } from "src/constants/searchCommunityConstants";

// eslint-disable-next-line import/prefer-default-export
export const getListCommunities = async (limit: number, cursor: string) => {
  try {
    const res = await api.get(`/user/communities?limit=${limit}&cursor=${cursor}`);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const getListCommunityHome = async (limit: number = 10, cursor: string = "") => {
  try {
    const res = await api.get(`/community?limit=${limit}&cursor=${cursor}`);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const getCommunity = async (communityId: any) => {
  try {
    const res = await api.get(`/community/${communityId}`);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const createCommunity = async (body: any) => {
  try {
    const res = await api.post(`community`, body);
    if (res.data) {
      toast.success(CREATE_COMMUNITY);
    }
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const updateCommunity = async (communityId, body: any) => {
  try {
    const res = await api.patch(`community/${communityId}`, body);
    if (!res.data.error_code) {
      toast.success(UPDATE_COMMUNITY);
    }
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const CommunityMembers = async (communityId, limit: number = 10, cursor: string = "") => {
  try {
    const res = await api.get(`community/${communityId}/members?limit=${limit}&cursor=${cursor}`);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const deleteCommunity = async (communityId) => {
  try {
    const res = await api.delete(`community/${communityId}`);
    if (!res.data.error_code) {
      toast.success(DELETE_COMMUNITY);
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const CommunityMembersBlocked = async (communityId, limit: number = 10, cursor: string = "") => {
  try {
    const res = await api.get(`community/${communityId}/members/blocked?limit=${limit}&cursor=${cursor}`);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const MemberBlocked = async (communityId, userId) => {
  try {
    const res = await api.post(`community/${communityId}/members/${userId}/block`);
    if (!res.data.error_code) {
      toast.success(BLOCK_MEMBER);
      return res;
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const MemberUnBlock = async (communityId, userId) => {
  try {
    const res = await api.post(`community/${communityId}/members/${userId}/unblock`);
    if (!res.data.error_code) {
      toast.success(BLOCKED_MEMBER);
      return res;
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const getParticipates = async (communityId, limit: number = 10, cursor: string = "") => {
  try {
    const res = await api.get(`community/${communityId}/join-requests?limit=${limit}&cursor=${cursor}`);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const MemberApprove = async (communityId, joinRequestId) => {
  try {
    const res = await api.post(`community/${communityId}/join-requests/${joinRequestId}/accept`);
    if (!res.data.error_code) {
      toast.success(APPPROVE_MEMBER);
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const MemberReject = async (communityId, joinRequestId) => {
  try {
    const res = await api.delete(`community/${communityId}/join-requests/${joinRequestId}/reject`);
    if (!res.data.error_code) {
      toast.success(REJECT_MEMBER);
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const checkMemberCommunity = async (communityId, memberId) => {
  try {
    const res = await api.get(`community/${communityId}/member/${memberId}`);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const createCommunityPost = async (communityId, body) => {
  try {
    const res = await api.post(`community/${communityId}/posts`, body);
    if (!res.data.error_code) {
      toast.success(CREATE_POST);
      return res.data;
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const detailCommunityPost = async (communityId, postId) => {
  try {
    const res = await api.get(`community/${communityId}/posts/${postId}`);
    if (!res.data.error_code) {
      return res.data;
    }
  } catch (error) {
    return error;
  }
};

export const updateCommunityPost = async (communityId, postId, body) => {
  try {
    const res = await api.patch(`community/${communityId}/posts/${postId}`, body);
    if (!res.data.error_code) {
      toast.success(UPDATE_POST);
      return res.data;
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const deleteCommunityPost = async (communityId, postId) => {
  try {
    const res = await api.delete(`community/${communityId}/posts/${postId}`);
    if (!res.data.error_code) {
      toast.success(DELETE_POST);
    }
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const createPostComment = async (communityId, postId, body) => {
  try {
    const res = await api.post(`community/${communityId}/posts/${postId}/comments`, body);
    if (!res.data.error_code) {
      toast.success(CREATE_COMMENT);
      return res.data;
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const updatePostComment = async (communityId, postId, commentId, body) => {
  try {
    const res = await api.patch(`community/${communityId}/posts/${postId}/comments/${commentId}`, body);
    if (!res.data.error_code) {
      toast.success(UPDATE_COMMENT);
      return res.data;
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const getListComment = async (
  communityId,
  postId,
  limit: number = 10,
  cursor: string = "",
  sortOrder: string = "latest",
) => {
  try {
    const res = await api.get(
      `community/${communityId}/posts/${postId}/comments?limit=${limit}&cursor=${cursor}&sort_order=${sortOrder}`,
    );
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const deleteCommunityPostComment = async (communityId, postId, commentId) => {
  try {
    const res = await api.delete(`community/${communityId}/posts/${postId}/comments/${commentId}`);
    if (!res.data.error_code) {
      toast.success(DELETE_COMMENT);
    }
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const getListCommunityPost = async (
  communityId,
  limit: number = 10,
  cursor: string = "",
  sortOrder: string = "latest",
) => {
  try {
    const res = await api.get(
      `community/${communityId}/posts/?limit=${limit}&cursor=${cursor}&sort_order=${sortOrder}`,
    );
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const joinCommunity = async (communityId, isPulic = true) => {
  try {
    const res = await api.post(`community/${communityId}/join`);
    if (!res.data.error_code) {
      if (isPulic) {
        toast.success(JOIN_COMMUNITY);
      } else {
        toast.success(SEND_REQUEST_COMMUNITY);
      }
      return res.data;
    }
  } catch (error) {
    // toast.error(SERVER_ERROR);
    return error;
  }
};

export const leaveCommunity = async (communityId) => {
  try {
    const res = await api.post(`community/${communityId}/leave`);
    if (!res.data.error_code) {
      toast.success(LEAVE_COMMUNITY);
      return res.data;
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const searchMemberCommunity = async (communityId, textName: string = "", limit: number = 10) => {
  try {
    const res = await api.get(`community/${communityId}/members/search?name=${textName}&limit=${limit}`);
    if (!res.data.error_code) {
      return res.data;
    }
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

// @ts-ignore
export const getListCommunitySearch = async (
  limit: number,
  cursor: string,
  // eslint-disable-next-line default-param-last
  order: string,
  params?: any,
  inputTags?: any,
  fullText?: string | string[],
) => {
  try {
    let query = `/community/search?limit=${limit}&cursor=${cursor}&sort_order=${order}`;
    // Query full text
    query += fullText ? `&fulltext=${fullText}` : "";
    // Query exclude joined communities
    query += params?.excludejoinedCommunities ? `&exclude_joined_communities=${params?.excludejoinedCommunities}` : "";
    // Query login count
    query += params?.login_count === typeCountLogin.no_0 ? `&login_count[]=""&login_count[]=""` : "";
    query += params?.login_count === typeCountLogin.less_than_5 ? `&login_count[]=0&login_count[]=5` : "";
    query += params?.login_count === typeCountLogin.less_than_10 ? `&login_count[]=0&login_count[]=10` : "";
    query += params?.login_count === typeCountLogin.less_than_15 ? `&login_count[]=0&login_count[]=15` : "";
    query += params?.login_count === typeCountLogin.more_than_20 ? `&login_count[]=20&login_count[]=""` : "";
    // Query member count
    query += params?.member_count === typeCountMember.no_0 ? `&member_count[]=""&member_count[]=""` : "";
    query += params?.member_count === typeCountMember.less_than_5 ? `&member_count[]=0&member_count[]=5` : "";
    query += params?.member_count === typeCountMember.less_than_10 ? `&member_count[]=0&member_count[]=10` : "";
    query += params?.member_count === typeCountMember.less_than_20 ? `&member_count[]=0&member_count[]=20` : "";
    query += params?.member_count === typeCountMember.more_than_30 ? `&member_count[]=30&member_count[]=""` : "";
    // Query tags
    for (let i = 0; i < inputTags.length; i++) {
      query += `&search_tags[]=${inputTags[i]}`;
    }

    const res = await api.get(query);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};
