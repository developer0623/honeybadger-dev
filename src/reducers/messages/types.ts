import {SET_MESSAGE, REMOVE_MESSAGE} from './actions';

export type MessageKind = 'error' | 'warning' | 'info' | '';

export interface MessagesState {
    message: string;
    kind: MessageKind;
}

export interface SetMessageAction {
    type: typeof SET_MESSAGE;
    message: string;
    kind: 'error' | 'warning' | 'info' | '';
}

export interface RemoveMessageAction {
    type: typeof REMOVE_MESSAGE;
}

export type MessagesActions = SetMessageAction | RemoveMessageAction;
