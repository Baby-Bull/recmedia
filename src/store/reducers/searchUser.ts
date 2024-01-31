import { SearchFormStatus } from "src/constants/constants";
import { searchUserActions } from "../actionTypes";

const initState = {};
export default function (state: any = initState, action: any) {
    const { type } = action;
    switch (type) {
        case searchUserActions.UPDATE_SCROLL_POSITION: {
            return {
                ...state,
                scrollPosition: action.payload.scrollPosition,
            };
        }

        case searchUserActions.UPDATE_RESULT: {
            return {
                ...state,
                formStatus: SearchFormStatus.Cached,
                result: {
                    ...state.result,
                    ...action.payload,
                },
            };
        }

        case searchUserActions.UPDATE_FORM: {
            return {
                ...state,
                form: {
                    ...state.form,
                    ...action.payload,
                },
            };
        }

        case searchUserActions.SEARCH_TAG_ONLY: {
            return {
                ...state,
                formStatus: SearchFormStatus.Init,
                form: {
                    job: 0,
                    employeeStatus: 0,
                    lastLogin: 0,
                    review: 0,
                    statusCanTalk: false,
                    statusLookingForFriend: false,
                    statusNeedConsult: false,
                    tags: [...(action.payload || [])],
                },
            };
        }

        case searchUserActions.APPEND_TAG: {
            return {
                ...state,
                formStatus: SearchFormStatus.Init,
                form: {
                    ...state.form,
                    tags: Array.from(new Set([...state.form.tags, ...action.payload])),
                },
            };
        }

        case searchUserActions.CLEAR_FORM: {
            return {
                ...state,
                formStatus: SearchFormStatus.Init,
                form: {
                    job: 0,
                    employeeStatus: 0,
                    lastLogin: 0,
                    review: 0,
                    statusCanTalk: false,
                    statusLookingForFriend: false,
                    statusNeedConsult: false,
                    tags: [],
                },
            };
        }
        default:
            return state;;
    }
}