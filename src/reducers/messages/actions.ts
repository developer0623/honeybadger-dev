import {SetMessageAction, RemoveMessageAction, MessageKind} from './types';

export const SET_MESSAGE = 'SET_MESSAGE';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';

export const setMessage = (
    message: string,
    kind: MessageKind,
): SetMessageAction => ({
    type: SET_MESSAGE,
    message,
    kind,
});

export const removeMessage = (): RemoveMessageAction => ({
    type: REMOVE_MESSAGE,
});
