import {SET_MESSAGE, REMOVE_MESSAGE} from './actions';
import {MessagesActions} from './types';

const initialState = {
    message: '',
    kind: '',
};

const messages = (state = initialState, action: MessagesActions) => {
    switch (action.type) {
        case SET_MESSAGE:
            return {...state, message: action.message, kind: action.kind};
        case REMOVE_MESSAGE:
            return {...state, ...initialState};
        default:
            return state;
    }
};

export default messages;
