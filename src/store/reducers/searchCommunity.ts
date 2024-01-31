import { SearchFormStatus } from "src/constants/constants";
import actionTypes, { searchCommunityActions } from "../actionTypes";

const initState = {}
export default function (state: any = initState, action: any) {
    const { type } = action;
    switch (type) {

        case actionTypes.LOGOUT: {
            return {
                formStatus: SearchFormStatus.Init,
                scrollPosition: 0,
                form: {
                    login_count: 0,
                    member_count: 0,
                    lastLogin: 0,
                    exclude_joined_communities: false,
                    tags: [],
                },
                result: {
                    sort: "recommended",
                    limit: 12,
                    cursor: "",
                    hasMore: false,
                    items: [],
                },

            };
        }
        
        case searchCommunityActions.UPDATE_SCROLL_POSITION: {
            return {
                ...state,
                scrollPosition: action?.payload.scrollPosition,
            };
        }

        case searchCommunityActions.UPDATE_RESULT: {
            return {
                ...state,
                formStatus: SearchFormStatus.Cached,
                result: {
                    ...state.result,
                    ...action.payload,
                },
            };
        }

        case searchCommunityActions.UPDATE_FORM: {
            return {
                ...state,
                form: {
                    ...state.form,
                    ...action.payload,
                },
            };
        }

        case searchCommunityActions.SEARCH_TAG_ONLY: {
            return {
                ...state,
                formStatus: SearchFormStatus.Init,
                form: {
                    login_count: 0,
                    member_count: 0,
                    lastLogin: 0,
                    exclude_joined_communities: false,
                    tags: [...(action.payload || [])],
                },
            };
        }

        case searchCommunityActions.APPEND_TAG: {
            return {
                ...state,
                formStatus: SearchFormStatus.Init,
                form: {
                    ...state.form,
                    tags: Array.from(new Set([...state.form.tags, ...action.payload])),
                },
            };
        }

        case searchCommunityActions.CLEAR_FORM: {
            return {
                ...state,
                formStatus: SearchFormStatus.Init,
                form: {
                    login_count: 0,
                    member_count: 0,
                    lastLogin: 0,
                    exclude_joined_communities: false,
                    tags: [],
                },
            };
        }

        default:
            return state;
    }
}