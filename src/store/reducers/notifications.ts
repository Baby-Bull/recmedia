import actionTypes from "../actionTypes";

const initState = {}
export default function (state: any = initState, action: any) {
    const { type } = action;

    switch (type) {
        case actionTypes.LOGIN:
            return {
                ...state,
                askPermissionNotification: true,
            };
        case actionTypes.LOGOUT:
            return {};
        case actionTypes.UPDATE_NOTIFICATIONS:
            return {
                ...state,
                items: action?.payload?.items || [],
                hasMore: action?.payload?.hasMore ?? false,
                cursor: action?.payload?.cursor ?? "",
                unread_count: action?.payload?.unread_count || 0,
                items_count: action?.payload?.items_count || 0,
            };
        case actionTypes.UPDATE_NOTIFICATION_UNREAD_COUNT:
            return {
                ...state,
                unread_count: action.payload.count || 0,
            };
        case actionTypes.ADD_NOTIFICATION:
            return {
                ...state,
                items: [action.payload.notification, ...state.items],
                unread_count: (state?.unread_count || 0) + 1,
                items_count: (state?.items_count || 0) + 1,
            };
        case actionTypes.ADD_UNREAD_NOTIFICATIONS_COUNT:
            return {
                ...state,
                unread_count: (state?.unread_count || 0) + 1,
            };
        case actionTypes.REMOVE_UNREAD_NOTIFICATIONS_COUNT:
            return {
                ...state,
                unread_count: 0,
            };
        case actionTypes.UPDATE_PERMISSION_NOTIFICATION:
            return {
                ...state,
                askPermissionNotification: false,
            };
        default:
            return state;
    }
}