import * as React from 'react';
import {View} from 'react-native';
import BigNumber from 'bignumber.js';
import {JSONPath} from 'jsonpath-plus';

import {knownContractNames} from '../constants/Token';

const UsdtzToken = (transaction: any) => {
    if (transaction.parameters.entrypoint === 'approve') {
        let approvedAddress = JSONPath({ path: '$.args[0].string', json: transaction.parameters.value })[0];
        const tokenAmount = new BigNumber(JSONPath({ path: '$.args[1].int', json: transaction.parameters.value })[0]).dividedBy('1000000').toFixed();

        approvedAddress = knownContractNames[approvedAddress] || approvedAddress;

        return (
            <>
                &nbsp;to approve <strong>{approvedAddress}</strong> for a balance of <strong>{tokenAmount}</strong> USDtz
            </>
        );
    }

    // TODO: transfer

    return null;
}

export default UsdtzToken;
