import {KeyStore} from 'conseiljs';
import {
    SET_TRANSACTIONS,
    SET_BALANCE,
    SET_KEYS,
    SET_SEND_STEP,
    SET_SEND_ADDRESS,
    SET_SEND_AMOUNT,
    SET_TERMS_DATE,
    SET_DELEGATE_ADDRESS,
    SET_REVEALED,
    SET_DELEGATION,
    SET_EXPECTEDDELEGATEDATE,
    SET_PENDING_OPERATIONS,
} from './actions';
import {Operation} from '../types';
export interface State {
    publicKey: string; // TODO: store a KeyStore object
    secretKey: string;
    publicKeyHash: string;
    storeType: string | number;
    seed: string;

    termsDate: string;
    //delegationNoticeDate: string; // TODO: don't show delegation notice more than once
    //betaNoticeDate: string; // TODO: send/receive small amounts notice

    balance: number; // TODO: transient state
    revealed: boolean; // TODO: transient state
    delegation: string;
    transactions: Array<Operation>;

    sendStep: number; // TODO: view state
    sendAddress: string;
    sendAmount: number;
    delegateAddress: string;
    expectedPaymentDate: Date;
    pendingTransactions: [];
    pendingDelegations: [];
}
export interface SetKeysAction {
    type: typeof SET_KEYS;
    keys: KeyStore;
}

export interface SetBalanceAction {
    type: typeof SET_BALANCE;
    balance: number;
}

export interface SetRevealedAction {
    type: typeof SET_REVEALED;
    revealed: boolean;
}

export interface SetTransactionsAction {
    type: typeof SET_TRANSACTIONS;
    transactions: Operation[];
}

export interface SetSendStepAction {
    type: typeof SET_SEND_STEP;
    step: number;
}

export interface SetSendAddressAction {
    type: typeof SET_SEND_ADDRESS;
    address: string;
}

export interface SetSendAmountAction {
    type: typeof SET_SEND_AMOUNT;
    amount: number;
}

export interface SetTermsDateAction {
    type: typeof SET_TERMS_DATE;
    date: string;
}

export interface SetDelegateAddressAction {
    type: typeof SET_DELEGATE_ADDRESS;
    address: string;
}

export interface SetDelegationAction {
    type: typeof SET_DELEGATION;
    delegation: string;
}

export interface SetDelegationExpectedDate {
    type: typeof SET_EXPECTEDDELEGATEDATE;
    date: Date;
}

export interface SetPendingOperationsAction {
    type: typeof SET_PENDING_OPERATIONS;
    transactions: any[];
    delegations: any[];
}

export type AppActions =
    | SetTransactionsAction
    | SetBalanceAction
    | SetRevealedAction
    | SetKeysAction
    | SetSendStepAction
    | SetSendAddressAction
    | SetSendAmountAction
    | SetTermsDateAction
    | SetDelegateAddressAction
    | SetDelegationAction
    | SetDelegationExpectedDate
    | SetPendingOperationsAction;
