import actionTypes from "../actionTypes";


const initState = {}
export default function (state: any = initState, action: any) {
    const { type } = action;
    switch (type) {
        case actionTypes.LOGIN:
            return action?.user?.profile || {};

        case actionTypes.LOGOUT:
            return {};

        case actionTypes.UPDATE_PROFILE:
            return {
                ...state,
                ...action.payload,
            };
        case actionTypes.ADD_FAVORITE:
            return {
                ...state,
                favorite_count: (state?.favorite_count || 0) + 1,
            };
        case actionTypes.REMOVE_FAVORITE:
            return {
                ...state,
                favorite_count: (state?.favorite_count || 0) - 1,
            };
        case actionTypes.ADD_MATCH_REQUEST_COUNT:
            return {
                ...state,
                match_request_count: (state?.match_request_count || 0) + 1,
            };
        case actionTypes.ADD_MATCH_REQUEST_PENDING_COUNT:
            return {
                ...state,
                match_request_pending_count: (state?.match_request_pending_count || 0) + 1,
            };
        case actionTypes.REMOVE_MATCH_REQUEST_PENDING_COUNT:
            return {
                ...state,
                match_request_pending_count: (state?.match_request_pending_count || 0) - 1,
            };
        case actionTypes.REMOVE_MATCH_REQUEST_COUNT:
            return {
                ...state,
                match_request_count: (state?.match_request_count || 0) - 1,
            };
        case actionTypes.ADD_COMMUNITY_COUNT:
            return {
                ...state,
                community_count: (state?.community_count || 0) + 1,
            };
        case actionTypes.REMOVE_COMMUNITY_COUNT:
            return {
                ...state,
                community_count: (state?.community_count || 0) - 1,
            };

        default:
            return state;

    }
}