import actionTypes from "../actionTypes";

const initState = true;
export default function (state: any = initState, action: any) {
    const { type } = action;
    switch (type) {
        case actionTypes.LOGIN:
            return action?.user?.is_profile_edited || false;
        default:
            return state;
    }
}