import actionTypes from "../actionTypes";

const initState = {}
export default function (state: any = initState, action: any) {
    const { type } = action;

    switch (type) {
        case actionTypes.LOGOUT:
            return {};
        case actionTypes.UPDATE_LIST_ROOMS:
            return {
                ...state,
                itemsPersonal: action.payload?.itemsPersonal || [],
                itemsCommunity: action.payload?.itemsCommunity || [],
                hasMorePersonal: action?.payload?.hasMorePersonal ?? false,
                hasMoreCommunity: action?.payload?.hasMoreCommunity ?? false,
                cursorPersonal: action?.payload?.cursorPersonal ?? "",
                cursorCommunity: action?.payload?.cursorCommunity ?? "",
                unread_count: action?.payload?.unread_count || 0,
            };
        case actionTypes.UPDATE_LIST_PERSONAL_CHAT_ROOMS:
            return {
                ...state,
                itemsPersonal: action.payload.items,
                ...(action.payload.hasMore !== undefined ? { hasMorePersonal: action.payload.hasMore } : {}),
                ...(action.payload.cursor !== undefined ? { cursorPersonal: action.payload.cursor } : {}),
            };
        case actionTypes.UPDATE_LIST_COMMUNITY_CHAT_ROOMS:
            return {
                ...state,
                itemsCommunity: action.payload.items,
                ...(action.payload.hasMore !== undefined ? { hasMoreCommunity: action.payload.hasMore } : {}),
                ...(action.payload.cursor !== undefined ? { cursorCommunity: action.payload.cursor } : {}),
            };
        case actionTypes.UPDATE_PERSONAL_CHATROOM_UNREAD_COUNT:
            return {
                ...state,
                itemsPersonal: state.itemsPersonal.map((chatroom) =>
                    chatroom.id === action.payload.chatRoomId
                        ? {
                            ...chatroom,
                            unread_message_count: action.payload.count,
                        }
                        : chatroom,
                ),
            };

        case actionTypes.UPDATE_COMMUNITY_CHATROOM_UNREAD_COUNT:
            return {
                ...state,
                itemsCommunity: state.itemsCommunity.map((chatroom) =>
                    chatroom.id === action.payload.chatRoomId
                        ? {
                            ...chatroom,
                            unread_message_count: action.payload.count,
                        }
                        : chatroom,
                ),
            };
        case actionTypes.UPDATE_UNREAD_LISTROOMS_COUNT:
            return {
                ...state,
                unread_count: action.payload.count,
            };
        case actionTypes.ADD_UNREAD_LISTROOMS_COUNT:
            return {
                ...state,
                unread_count: (state?.unread_count || 0) + 1,
            };
        case actionTypes.REMOVE_UNREAD_LISTROOMS_COUNT:
            return {
                ...state,
                unread_count: 0,
            };
        default:
            return state;
    }
}