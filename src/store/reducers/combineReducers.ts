import { combineReducers } from "redux";
import user from "./user";
import search_users from "./searchUser";
import notifications from "./notifications";
import listrooms from "./listrooms";
import is_profile_edited from "./isEditedProfile";
import search_community from "./searchCommunity";

const rootReducer = combineReducers({
    user,
    search_users,
    notifications,
    listrooms,
    search_community,
    is_profile_edited,
})
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;