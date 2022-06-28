import {
    ConseilQueryBuilder,
    ConseilOperator,
    ConseilSortDirection,
    Delegation,
    TezosConseilClient,
    TezosConstants,
    TezosMessageUtils,
    TezosNodeReader,
    TezosNodeWriter
} from 'conseiljs';
import {Dispatch} from 'redux';

import config from '../../config';
import {KeyStoreUtils, SoftSigner} from '../../softsigner';

import constants from '../../utils/constants.json';
import {State} from '../types';

import {BakerInfo} from '../types';

import {
    setBalanceAction,
    setRevealedAction,
    setTransactions,
    setDelegation,
    setDelegateExpectedDate,
    setPendingOperations
} from './actions';

export const syncAccount = () => async (
    dispatch: any,
    getState: () => State,
) => {
    try {
        const publicKeyHash = getState().app.publicKeyHash;

        try {
            let {balance, delegate} = await getAccountInfo(publicKeyHash);
            dispatch(setBalanceAction(balance));

            if (delegate.length > 0) { // TODO: query once per session
                const bakerDetails = await getBakerDetails(delegate);
                if (bakerDetails.name.length > 0) { delegate = bakerDetails.name; }
            }

            dispatch(setDelegation(delegate));

            const {expectedPaymentDate} = await getLastDelegation(publicKeyHash);
            dispatch(setDelegateExpectedDate(expectedPaymentDate));
        } catch (balanceError) {}

        try {
            if (!getState().app.revealed) {
                const isRevealed = await TezosNodeReader.isManagerKeyRevealedForAccount(
                    config[0].nodeUrl,
                    publicKeyHash,
                );
                dispatch(setRevealedAction(isRevealed));
            }
        } catch (revealError) {}

        try {
            // TODO: query for transactions since last sync - 60 seconds
            const transactions = await getTransactions(publicKeyHash);
            dispatch(setTransactions(transactions));
        } catch (transactionError) {}

        await dispatch(getPendingOperations());
        // TODO: tokens
    } catch (e) {}
};

export const getAccountInfo = async (accountHash: string): Promise<{balance: number, delegate: string}> => {
    const conseilUrl = config[0].url;
    const apiKey = config[0].apiKey;
    const network = config[0].network;

    let accountQuery = ConseilQueryBuilder.blankQuery();
    accountQuery = ConseilQueryBuilder.addFields(accountQuery, 'block_level','balance','delegate_value','counter','is_activated');
    accountQuery = ConseilQueryBuilder.addPredicate(accountQuery, 'account_id', ConseilOperator.EQ, [accountHash], false);
    accountQuery = ConseilQueryBuilder.setLimit(accountQuery, 1);

    const result = await TezosConseilClient.getAccounts({url: conseilUrl, apiKey, network}, network, accountQuery);

    if (result && result.length > 0) {
        return {balance: Number(result[0]['balance']), delegate: result[0]['delegate_value'] || '' };
    }

    return {balance: 0, delegate: ''};
};

export const getTransactions = async (accountHash: string) => {
    const conseilUrl = config[0].url; // TODO: read from state as an object
    const apiKey = config[0].apiKey;
    const network = config[0].network;

    let origin = ConseilQueryBuilder.blankQuery();
    origin = ConseilQueryBuilder.addFields(origin, 'timestamp', 'source', 'destination', 'amount', 'operation_group_hash', 'delegate', 'kind', 'parameters_entrypoints');
    origin = ConseilQueryBuilder.addPredicate(origin, 'kind', ConseilOperator.IN, ['transaction', 'delegation'], false);
    origin = ConseilQueryBuilder.addPredicate(origin, 'source', ConseilOperator.EQ, [accountHash], false);
    origin = ConseilQueryBuilder.addPredicate(origin, 'internal', ConseilOperator.EQ, ['false'], false);
    origin = ConseilQueryBuilder.addPredicate(origin, 'status', ConseilOperator.EQ, ['applied'], false);
    origin = ConseilQueryBuilder.addOrdering(origin, 'block_level', ConseilSortDirection.DESC);
    origin = ConseilQueryBuilder.setLimit(origin, 1000);

    let target = ConseilQueryBuilder.blankQuery();
    target = ConseilQueryBuilder.addFields(target, 'timestamp', 'source', 'destination', 'amount', 'operation_group_hash', 'delegate', 'kind', 'parameters_entrypoints');
    target = ConseilQueryBuilder.addPredicate(target, 'kind', ConseilOperator.EQ, ['transaction'], false);
    target = ConseilQueryBuilder.addPredicate(target, 'destination', ConseilOperator.EQ, [accountHash], false);
    target = ConseilQueryBuilder.addPredicate(target, 'internal', ConseilOperator.EQ, ['false'], false);
    target = ConseilQueryBuilder.addPredicate(target, 'status', ConseilOperator.EQ, ['applied'], false);
    target = ConseilQueryBuilder.addOrdering(target, 'block_level', ConseilSortDirection.DESC);
    target = ConseilQueryBuilder.setLimit(target, 1000);

    return Promise.all(
        [target, origin].map((q) => TezosConseilClient.getOperations({url: conseilUrl, apiKey, network}, network, q)))
        .then((responses) => {
            return responses.reduce((o, i) => {
                i.forEach((ii) =>
                    o.push({
                        timestamp: ii['timestamp'],
                        source: ii['source'],
                        destination: ii['destination'],
                        amount: ii['amount'],
                        opGroupHash: ii['operation_group_hash'],
                        delegate: ii['delegate'],
                        kind: ii['kind'],
                        entrypoint: ii['parameters_entrypoints'] || '',
                    }),
                );
                return o;
            }, []);
        })
        .then((transactions) => {
            console.log(`transactions: ${JSON.stringify(transactions)}`);
            return transactions.sort((a, b) => b.timestamp - a.timestamp);
        });
};

export const getLastDelegation = async (accountHash: string) => {
    const conseilUrl = config[0].url; // TODO: read from state as an object
    const apiKey = config[0].apiKey;
    const network = config[0].network;

    let delegationQuery = ConseilQueryBuilder.blankQuery();
    delegationQuery = ConseilQueryBuilder.addFields(delegationQuery, 'timestamp', 'operation_group_hash', 'delegate', 'cycle');
    delegationQuery = ConseilQueryBuilder.addPredicate(delegationQuery, 'kind', ConseilOperator.EQ, ['delegation'], false);
    delegationQuery = ConseilQueryBuilder.addPredicate(delegationQuery, 'source', ConseilOperator.EQ, [accountHash], false);
    delegationQuery = ConseilQueryBuilder.addPredicate(delegationQuery, 'internal', ConseilOperator.EQ, ['false'], false);
    delegationQuery = ConseilQueryBuilder.addPredicate(delegationQuery, 'status', ConseilOperator.EQ, ['applied'], false);
    delegationQuery = ConseilQueryBuilder.addOrdering(delegationQuery, 'block_level', ConseilSortDirection.DESC);
    delegationQuery = ConseilQueryBuilder.setLimit(delegationQuery, 1);

    const delegation = await TezosConseilClient.getOperations({url: conseilUrl, apiKey, network}, network, delegationQuery);

    const head = await TezosConseilClient.getBlockHead({url: conseilUrl, apiKey, network}, network);

    const offset = Number(head['meta_cycle']) - Number(delegation[0]['cycle']);
    const expected = ((offset >= 7 + 5 ? 0 : (12 - offset) * 4096) + (4096 - Number(head['meta_cycle_position'])) + 1) * 60 * 1000;

    //TODO: if current delegate is blank, the payout continue since the time it was cleared for 5 cycles

    return {delegate: delegation[0]['delegate'], expectedPaymentDate: new Date(Date.now() + expected) };
}

export const sendTransaction = () => async (
    dispatch: any,
    getState: () => State,
) => {
    try {
        const tezosUrl = config[0].nodeUrl; // TODO: getState().config
        const address = getState().app.sendAddress; // TODO do not use state, use parameters
        const amount = getState().app.sendAmount; // TODO do not use state, use parameters
        const secretKey = getState().app.secretKey;
        const isRevealed = getState().app.revealed;
        const keyStore = await KeyStoreUtils.restoreIdentityFromSecretKey(secretKey); // TODO
        const signer = new SoftSigner(TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, 'edsk'));

        await TezosNodeWriter.sendTransactionOperation(
            tezosUrl,
            signer,
            keyStore,
            address,
            amount,
            isRevealed ? constants.fees.simpleTransaction : constants.fees.simpleTransaction + constants.fees.reveal,
        );

        await dispatch(getPendingOperations());
    } catch (e) {
        console.log('error-transaction', e);
    }
};

export const sendDelegation = () => async (dispatch: any, getState: () => State) => {
    try {
        const tezosUrl = config[0].nodeUrl; // TODO: getState().config
        const address = getState().app.delegateAddress; // TODO do not use state, use parameters
        const secretKey = getState().app.secretKey;
        const isRevealed = getState().app.revealed;
        const keyStore = await KeyStoreUtils.restoreIdentityFromSecretKey(secretKey);
        const signer = new SoftSigner(TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, 'edsk'));
        await TezosNodeWriter.sendDelegationOperation(
            tezosUrl,
            signer,
            keyStore,
            address,
            isRevealed ? constants.fees.delegation : constants.fees.delegation + constants.fees.reveal,
        );

        await dispatch(getPendingOperations());
    } catch (e) {
        console.log('error-delegation', e);
    }
};

export const cancelDelegation = () => async (dispatch: Dispatch, getState: () => State) => {
    try {
        const tezosUrl = config[0].nodeUrl; // TODO: getState().config
        const secretKey = getState().app.secretKey;
        const isRevealed = getState().app.revealed;
        const keyStore = await KeyStoreUtils.restoreIdentityFromSecretKey(
            secretKey,
        );
        const signer = new SoftSigner(
            TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, 'edsk'),
        );

        await TezosNodeWriter.sendDelegationOperation(tezosUrl, signer, keyStore, undefined, constants.fees.clearDelegation);
    } catch(e) {
        console.log('error-cancel-delegation');
    }
}

export function processNodeOperationGroup(group: any, ttl: number = 0) {
    const first = group.contents[0];

    /*
    amount: Number(first.amount),
    balance: 0,
    block_hash: '',
    block_level: -1,
    delegate: first.delegate || '',
    destination: first.destination || '',
    fee: parseInt(first.fee, 10),
    gas_limit: parseInt(first.gas_limit, 10),
    kind: first.kind,
    operation_group_hash: group.hash,
    operation_id: 'OPID',
    pkh: first.pkh || '',
    status: 'Pending',
    source: first.source || '',
    storage_limit: parseInt(first.storage_limit, 10),
    timestamp: new Date(),
    ttl
    */

    return {
        amount: Number(first.amount),
        delegate: first.delegate || '',
        destination: first.destination || '',
        fee: parseInt(first.fee, 10),
        kind: first.kind,
        operation_group_hash: group.hash,
        pkh: first.pkh || '',
        status: 'Pending',
        source: first.source || '',
        timestamp: new Date(),
    };
}

export const getPendingOperations = () => async (dispatch: Dispatch, getState: () => State) => {
    try {
        const tezosUrl = config[0].nodeUrl; // TODO: getState().config
        const publicKeyHash = getState().app.publicKeyHash;
        const pendingGroups: any[] = await TezosNodeReader.getMempoolOperationsForAccount(tezosUrl, publicKeyHash);
        const pendingOperations = await Promise.all(pendingGroups.map(
                async (g) => processNodeOperationGroup(g, await TezosNodeReader.estimateBranchTimeout(tezosUrl, g.branch))
              ));
        const transactions = pendingOperations.filter((o) => o.kind === 'transaction');
        const delegations = pendingOperations.filter((o) => o.kind === 'delegation');
        dispatch(setPendingOperations(transactions, delegations));
    } catch (e) {
        console.log('error-pending-transactions', e);
    }
}

export const validateBakerAddress = async (to: string, from: string) => {
    if (to === from) {
        throw new Error('Sending to yourself is not allowed');
    }

    if (!(['tz1', 'tz2', 'tz3'].includes(to.substring(0, 3)))) {
        throw new Error('Baker address must start with tz1, tz2 or tz3');
    }

    if (to.match(/[^1-9A-HJ-NP-Za-km-z]/)) {
        throw new Error('Address contains invalid characters');
    }

    if (to.length < 36) {
        throw new Error('Address too short');
    }

    if (to.length > 36) {
        throw new Error('Address too long');
    }

    try {
        await TezosNodeReader.getAccountForBlock(config[0].nodeUrl, 'head', to);
    } catch (error) {
        if (error.httpStatus === 400) {
            throw new Error('Address not found on chain');
        }
        throw new Error('Could not query chain for address');
    }
};

export const getBakerDetails = async (address: string): Promise<BakerInfo> => { // TODO: needs return type
    try {
        const response = await fetch(`https://api.baking-bad.org/v2/bakers/${address}`);
        const responseJSON = await response.json();
        /*
        address: "tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT"
        audit: "5ee0c01a5e0a85c68fb18c90"
        balance: 855823.515106
        estimatedRoi: 0.059174
        fee: 0.0499
        freeSpace: 762587.1057459991
        insuranceCoverage: 2.97
        logo: "https://services.tzkt.io/v1/logos/tezgate.png"
        maxStakingBalance: 9181010.777211
        minDelegation: 100
        name: "Tezgate"
        openForDelegation: true
        payoutAccuracy: "precise"
        payoutDelay: 1
        payoutPeriod: 1
        payoutTiming: "stable"
        serviceHealth: "active"
        serviceType: "tezos_only"
        stakingBalance: 8418423.671465
        stakingCapacity
        */

        if (responseJSON.error !== undefined && responseJSON.error.length > 0) { throw ''; }

        return {address, name: responseJSON.name, fee: responseJSON.fee, logoUrl: responseJSON.logo || '', estimatedRoi: responseJSON.estimatedRoi};
    } catch (e) {
        console.log('getBakerDetails', e);
    }
    return {address, name: '', fee: 0, logoUrl: '', estimatedRoi: 0};
};

export const estimateOperationFee = async (operations: any, secretKey: any): Promise<number> => {
    try {
        const keyStore = await KeyStoreUtils.restoreIdentityFromSecretKey(secretKey);
        const tezosUrl = config[0].nodeUrl;

        const formedOperations: any = await createOperationGroup(operations, tezosUrl, keyStore.publicKeyHash, keyStore.publicKey);

        const estimate = await TezosNodeWriter.estimateOperationGroup(tezosUrl, 'main', formedOperations);

        return Number(estimate.estimatedFee);
    } catch (err) {
        // console.log('failed estimation')
        // console.log(JSON.stringify(err))
        return -1; // TODO: present error to user
    }
}

export async function createOperationGroup(
    operations: any[],
    tezosUrl: string,
    publicKeyHash: string,
    publicKey: string) {
    const networkCounter = await TezosNodeReader.getCounterForAccount(
        tezosUrl,
        publicKeyHash,
    );
    const formedOperations: any[] = [];

    let counter = networkCounter;
    for (const o of operations) {
        counter += 1;

        switch (o.kind) {
            case 'transaction': {
                let entrypoint: string | undefined;
                let parameters: string | undefined;

                try {
                    entrypoint = o.parameters.entrypoint;
                    parameters = JSON.stringify(o.parameters.value);
                } catch {
                    //
                }

                try {
                    if (entrypoint === 'mint_OBJKT') { // TODO: FIX mint operations bytes convert
                        if (Array.isArray(o.parameters.value.args[1].args[0].bytes)) {
                            const processedBytes = Buffer.from(o.parameters.value.args[1].args[0].bytes).toString('hex');
                            o.parameters.value.args[1].args[0].bytes = processedBytes;
                            parameters = JSON.stringify(o.parameters.value);
                        }
                    }
                } catch {
                    //
                }

                const op = TezosNodeWriter.constructContractInvocationOperation(
                    publicKeyHash,
                    counter,
                    o.destination,
                    o.amount,
                    0,
                    TezosConstants.OperationStorageCap,
                    TezosConstants.OperationGasCap,
                    entrypoint,
                    parameters,
                );

                formedOperations.push(op);

                break;
            }
            case 'delegation': {
                const op: Delegation = {
                    kind: 'delegation',
                    source: publicKeyHash,
                    fee: '0',
                    counter: counter.toString(),
                    storage_limit:
                        TezosConstants.DefaultDelegationStorageLimit.toString(),
                    gas_limit:
                        TezosConstants.DefaultDelegationGasLimit.toString(),
                    delegate: o.delegate,
                };

                formedOperations.push(op);

                break;
            }
            default: {
                break;
            }
        }
    }

    return await TezosNodeWriter.appendRevealOperation(tezosUrl, publicKey, publicKeyHash, networkCounter, formedOperations);
}
