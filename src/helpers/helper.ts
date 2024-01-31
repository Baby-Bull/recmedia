/* eslint-disable no-param-reassign */

export const sortListRoomChat = (listRooms: any) => {
  const listRoomSort = listRooms?.filter((item: any) => item.last_chat_message_at);
  const listRoomNoSort = listRooms?.filter((item: any) => !item.last_chat_message_at);
  listRoomSort.sort((a: any, b: any) => {
    const dateA = Date.parse(a.last_chat_message_at);
    const dateB = Date.parse(b.last_chat_message_at);
    return dateB - dateA > 0 ? 1 : -1;
  });
  return [...listRoomSort, ...listRoomNoSort];
};

const equalsYearMonthDate = (date1: Date, date2: Date) => {
  const equalsFullYear = date1.getFullYear() === date2.getFullYear();
  const equalsMonth = date1.getMonth() === date2.getMonth();
  const equalsDate = date1.getDate() === date2.getDate();

  return equalsFullYear && equalsMonth && equalsDate;
};

export const formatChatDateRoom = (date: string) => {
  const chatRoomDate = new Date(date);
  if (equalsYearMonthDate(new Date(), chatRoomDate)) {
    return `${chatRoomDate.getHours()}:${chatRoomDate.getMinutes().toString().padStart(2, "0")}`;
  }
  return `${chatRoomDate.getFullYear()}/${chatRoomDate.getMonth() + 1}/${chatRoomDate.getDate()}`;
};

export const formatChatDate = (chatDate: string) => {
  const date = new Date(chatDate);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
};

export const formatDateToText = (date: string) => {
  const newDate = new Date(date);
  const now = new Date();

  if (
    newDate.getFullYear() === now.getFullYear() &&
    newDate.getMonth() === now.getMonth() &&
    newDate.getDate() === now.getDate()
  ) {
    return "今日";
  }

  return `${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}`;
};

export const formatListMessages = (messages: any) => {
  let preViousDate = null;
  return messages.reduce((prev: any, item: any) => {
    const itemDate = new Date(item.created_at);
    if (!preViousDate || !equalsYearMonthDate(preViousDate, itemDate)) {
      prev[formatDateToText(item.created_at)] = [item];
    } else {
      prev[formatDateToText(item.created_at)] = [...prev[formatDateToText(item.created_at)], item];
    }
    preViousDate = itemDate;
    return prev;
  }, {});
};

export function swapTags(text) {
  const tags = Array.from(text.matchAll(/@\{(.+)\|(.+)\}/g), (m: any) => ({
    match: m[0],
    group: m.length > 1 ? m.slice(1) : undefined,
    startIndex: m.index,
  }));
  return tags;
}
