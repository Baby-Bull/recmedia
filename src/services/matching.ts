import { toast } from "react-toastify";

import { api } from "src/helpers/api";
import { ACCEPT_MATCHING, REJECT_MATCHING, CANCEL_MATCHING, SERVER_ERROR } from "src/messages/notification";

export const sendMatchingRequest = async (userId: string | string[], body: any) => {
  try {
    const res = await api.post(`/user/match/${userId}`, body);
    if (res.data.error_code) {
      toast.error(SERVER_ERROR);
    } else {
      toast.success("マッチングリクエストを送りました。");
    }
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMatchingRequestSent = async (limit: number, cursor: string, status: string) => {
  try {
    const res = await api.get(`/user/me/match-requests/sent?limit=${limit}&cursor=${cursor}&status=${status}`);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const getMatchingRequestReceived = async (limit: number, cursor: string, status: string) => {
  try {
    const res = await api.get(`/user/me/match-requests/received?limit=${limit}&cursor=${cursor}&status=${status}`);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const getMatchedRequest = async (limit: number, cursor: string, sort: string) => {
  try {
    const res = await api.get(`/user/match/?limit=${limit}&cursor=${cursor}&sort=${sort}`);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const acceptMatchingRequestReceived = async (matchRequestReceivedId: string) => {
  try {
    const res = await api.post(`/user/match-requests/${matchRequestReceivedId}/accept`);
    toast.success(ACCEPT_MATCHING);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const rejectMatchingRequestReceived = async (matchRequestReceivedId: string) => {
  try {
    const res = await api.post(`/user/match-requests/${matchRequestReceivedId}/reject`);
    toast.success(REJECT_MATCHING);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};
export const cancelMatchingRequestSent = async (matchRequestSentId: string) => {
  try {
    const res = await api.delete(`/user/match-requests/${matchRequestSentId}/cancel`);
    toast.success(CANCEL_MATCHING);
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};
