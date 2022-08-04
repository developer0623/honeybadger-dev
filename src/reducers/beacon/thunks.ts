import {NativeModules} from 'react-native';
import { TezosNodeWriter, TezosMessageUtils } from 'conseiljs';
import {KeyStoreUtils, SoftSigner} from '../../softsigner';

import {State} from '../types';

import constants from '../../utils/constants.json';
import config from '../../config';

import {createOperationGroup, getPendingOperations} from '../app/thunks';

import {setMessage} from '../messages/actions';

import {clearOperationId} from '../../utils/general';
import { BeaconErrorTypes } from '../../beacon/types';

export const beaconSendTransaction =
    (
        destination: string,
        amount: number,
        navigation: {navigate: (target: string, params?: any) => void},
    ) =>
    async (dispatch: any, getState: () => State) => {
        try {
            const tezosUrl = config[0].nodeUrl;
            const secretKey = getState().app.secretKey;
            const isRevealed = getState().app.revealed;
            const keyStore = await KeyStoreUtils.restoreIdentityFromSecretKey(
                secretKey,
            );
            const signer = new SoftSigner(
                TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, 'edsk'),
            );

            await TezosNodeWriter.sendTransactionOperation(
                tezosUrl,
                signer,
                keyStore,
                destination,
                amount,
                isRevealed
                    ? constants.fees.simpleTransaction
                    : constants.fees.simpleTransaction + constants.fees.reveal,
            );

            await dispatch(getPendingOperations());
            navigation.navigate('Account');
        } catch (e) {
            console.log('error-transaction', e);
            navigation.navigate('Account');
        }
    };

export const beaconSendDelegation =
    (
        destination: string,
        navigation: {navigate: (target: string, params?: any) => void},
    ) =>
    async (dispatch: any, getState: () => State) => {
        try {
            const tezosUrl = config[0].nodeUrl;
            const secretKey = getState().app.secretKey;
            const isRevealed = getState().app.revealed;
            const keyStore = await KeyStoreUtils.restoreIdentityFromSecretKey(
                secretKey,
            );
            const signer = new SoftSigner(
                TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, 'edsk'),
            );
            await TezosNodeWriter.sendDelegationOperation(
                tezosUrl,
                signer,
                keyStore,
                destination,
                isRevealed
                    ? constants.fees.delegation
                    : constants.fees.delegation + constants.fees.reveal,
            );

            await dispatch(getPendingOperations());
            navigation.navigate('Account');
        } catch (e) {
            console.log('error-delegation', e);
            navigation.navigate('Account');
        }
    };

export const beaconSendOperations =
    (operations: any[], fee: number = 0) =>
    async (dispatch: any, getState: any): Promise<any> => {
        try {
            const secretKey = getState().app.secretKey;
            const publicKeyHash = getState().app.publicKeyHash;
            const tezosUrl = config[0].nodeUrl;
            const keyStore = await KeyStoreUtils.restoreIdentityFromSecretKey(
                secretKey,
            );
            const signer = new SoftSigner(
                TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, 'edsk'),
            );

            const formedOperations: any = await createOperationGroup(
                operations,
                tezosUrl,
                publicKeyHash,
                keyStore.publicKey,
            );

            const estimate = await TezosNodeWriter.estimateOperationGroup(
                tezosUrl,
                'main',
                formedOperations,
            );

            for (let i = 0; i < formedOperations.length; i++) {
                if (i === 0 && fee === 0) {
                    formedOperations[i].fee = estimate.estimatedFee.toString();
                } else if (i === 0 && fee > 0) {
                    formedOperations[i].fee = fee.toString();
                }

                formedOperations[i].gas_limit =
                    estimate.operationResources[i].gas.toString();
                formedOperations[i].storage_limit =
                    estimate.operationResources[i].storageCost.toString();
            }

            const result: any = await TezosNodeWriter.sendOperation(
                tezosUrl,
                formedOperations,
                signer,
            ).catch(err => {
                const errorObj = {name: err.message, ...err};
                console.log(err);
                dispatch(setMessage(errorObj.name, 'error'));
                return undefined;
            });

            if (result) {
                const operationResult =
                    result &&
                    result.results &&
                    result.results.contents &&
                    result.results.contents[0] &&
                    result.results.contents[0].metadata &&
                    result.results.contents[0].metadata.operation_result;

                if (
                    operationResult &&
                    operationResult.errors &&
                    operationResult.errors.length
                ) {
                    const error = 'Smart Contract operation failed';
                    console.log(
                        'processOperationResult failed with',
                        operationResult.errors,
                    );
                    dispatch(setMessage(error, 'error'));
                    return false;
                }

                const clearedOperationId = clearOperationId(
                    result.operationGroupID,
                );

                beaconNotifyOperation(clearedOperationId, publicKeyHash);

                dispatch(
                    setMessage(
                        `Successfully started contract invocation. ${clearedOperationId}`,
                        'info',
                    ),
                );

                return true;
            }

            return false;
        } catch (e) {
            console.log('MINT', e);
        }
    };

export const beaconNotifyCancel = () => {
    NativeModules.BeaconBridge.sendError(BeaconErrorTypes.ABORTED_ERROR)
};

export const beaconNotifyOperation = (operationHash: string, publicKeyHash: string) => {
    NativeModules.BeaconBridge.sendResponse(operationHash, publicKeyHash);
};
