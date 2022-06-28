import {AppActions} from './types';

import {
    SET_KEYS,
    SET_BALANCE,
    SET_SEND_STEP,
    SET_SEND_ADDRESS,
    SET_TRANSACTIONS,
    SET_SEND_AMOUNT,
    SET_TERMS_DATE,
    SET_DELEGATE_ADDRESS,
    SET_REVEALED,
    SET_DELEGATION,
    SET_EXPECTEDDELEGATEDATE,
    SET_PENDING_OPERATIONS,
} from './actions';

const initialState = {
    publicKey: null,
    secretKey: null,
    publicKeyHash: null,
    storeType: '',
    seed: '',
    balance: 0,
    revealed: false,
    transactions: [],
    delegation: [],
    sendStep: 1,
    sendAddress: '',
    sendAmount: 0,
    termsDate: '',
    delegateAddress: '',
    expectedPaymentDate: null,
    pendingTransactions: [],
    pendingDelegations: [],
};

const app = (state = initialState, action: AppActions) => {
    switch (action.type) {
        case SET_KEYS:
            const {publicKey, secretKey, publicKeyHash, storeType, seed} =
                action.keys;
            return {
                ...state,
                publicKey,
                secretKey,
                publicKeyHash,
                storeType,
                seed,
            };
        case SET_BALANCE:
            return {...state, balance: action.balance};
        case SET_REVEALED:
            return {...state, revealed: action.revealed};
        case SET_SEND_STEP:
            return {...state, sendStep: action.step};
        case SET_SEND_ADDRESS:
            return {...state, sendAddress: action.address};
        case SET_SEND_AMOUNT:
            return {...state, sendAmount: action.amount};
        case SET_TRANSACTIONS:
            return {...state, transactions: action.transactions};
        case SET_TERMS_DATE:
            return {...state, termsDate: action.date};
        case SET_DELEGATE_ADDRESS:
            return {...state, delegateAddress: action.address};
        case SET_DELEGATION:
            return {...state, delegation: action.delegation};
        case SET_EXPECTEDDELEGATEDATE:
            return {...state, expectedPaymentDate: action.date};
        case SET_PENDING_OPERATIONS:
            return {
                ...state,
                pendingTransactions: action.transactions,
                pendingDelegations: action.delegations,
            };
        default:
            return state;
    }
};

export default app;
