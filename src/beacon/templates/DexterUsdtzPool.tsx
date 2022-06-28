import * as React from 'react';
import {View} from 'react-native';
import BigNumber from 'bignumber.js';
import {JSONPath} from 'jsonpath-plus';

import {knownMarketMetadata} from '../constants/Token';

const DexterUsdtzPool = (transaction: any) => {
    if (transaction.parameters.entrypoint === 'xtzToToken') {
        const holder = JSONPath({ path: '$.args[0].string', json: transaction.parameters.value })[0];
        const tokenAmount = new BigNumber(JSONPath({ path: '$.args[1].args[0].int', json: transaction.parameters.value })[0])
            .dividedBy('1000000')
            .toFixed();
        const expiration = new Date(JSONPath({ path: '$.args[1].args[1].string', json: transaction.parameters.value })[0]);

        return (
            <>
                &nbsp;to receive <strong>{tokenAmount.toString()}</strong> USDtz at <strong>{holder}</strong>, expiring on{' '}
                <strong>{expiration.toString()}</strong>
            </>
        );
    }

    if (transaction.parameters.entrypoint === 'addLiquidity') {
        const holder = JSONPath({ path: '$.args[0].args[0].string', json: transaction.parameters.value })[0];
        // TODO: $.args[0].args[1].int liquidity token balance
        const tokenAmount = new BigNumber(JSONPath({ path: '$.args[1].args[0].int', json: transaction.parameters.value })[0])
            .dividedBy('1000000')
            .toFixed();
        const expiration = new Date(JSONPath({ path: '$.args[1].args[1].string', json: transaction.parameters.value })[0]);

        return (
            <>
                &nbsp;to add <strong>{tokenAmount.toString()}</strong> USDtz to the pool from <strong>{holder}</strong>, expiring on{' '}
                <strong>{expiration.toString()}</strong>
            </>
        );
    }

    if (transaction.parameters.entrypoint === 'tokenToToken') {
        const targetToken = JSONPath({ path: '$.args[0].args[0].string', json: transaction.parameters.value })[0];
        // const targetName = knownContractNames[targetToken] || targetToken;
        const targetSymbol = knownMarketMetadata.filter((o) => o.address === targetToken)[0].symbol || 'tokens';
        const targetScale = knownMarketMetadata.filter((o) => o.address === targetToken)[0].scale || 0;
        const targetAmount = new BigNumber(JSONPath({ path: '$.args[0].args[1].args[0].int', json: transaction.parameters.value })[0])
            .dividedBy(10 ** targetScale)
            .toFixed();
        const targetHolder = JSONPath({ path: '$.args[0].args[1].args[1].string', json: transaction.parameters.value })[0];
        const sourceHolder = JSONPath({ path: '$.args[1].args[0].string', json: transaction.parameters.value })[0];
        const sourceAmount = new BigNumber(JSONPath({ path: '$.args[1].args[1].args[0].int', json: transaction.parameters.value })[0])
            .dividedBy('1000000')
            .toFixed();
        const expiration = new Date(JSONPath({ path: '$.args[1].args[1].args[1].string', json: transaction.parameters.value })[0]);

        let holderText = '';
        if (targetHolder === sourceHolder) {
            holderText = `for ${targetHolder}`;
        } else {
            holderText = `from ${sourceHolder} to ${targetHolder}`;
        }

        return (
            <>
                &nbsp;to exchange <strong>{sourceAmount.toString()}</strong> USDtz for <strong>{targetAmount.toString()}</strong> {targetSymbol}{' '}
                <strong>{holderText}</strong>, expiring on <strong>{expiration.toString()}</strong>
            </>
        );
    }

    return null;
}

export default DexterUsdtzPool;
