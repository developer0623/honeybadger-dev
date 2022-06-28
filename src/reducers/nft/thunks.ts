import {
    ConseilQueryBuilder,
    ConseilOperator,
    TezosConseilClient,
    TezosMessageUtils,
    TezosNodeReader,
    MultiAssetTokenHelper,
} from 'conseiljs';
import {BigNumber} from 'bignumber.js';
import {JSONPath} from 'jsonpath-plus';
import {Buffer} from 'buffer';

import {KeyStoreUtils, SoftSigner} from '../../softsigner';

import {chunkArray} from './util';

import config from '../../config';

import {setMessage} from '../messages/actions';

export function transferThunk(
    destination: string,
    amount: number,
    tokenid: number,
    fee: number = 0,
    gas: number = 0,
    storage: number = 0,
) {
    return async (dispatch: any, getState: any) => {
        const secretKey = getState().app.secretKey;
        const publicKeyHash = getState().app.publicKeyHash;

        const tezosUrl = config[0].nodeUrl;
        const tokenAddress = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton';
        const keyStore = await KeyStoreUtils.restoreIdentityFromSecretKey(
            secretKey,
        );
        const signer = new SoftSigner(
            TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, 'edsk'),
        );

        const operationId = await MultiAssetTokenHelper.transfer(
            tezosUrl,
            tokenAddress,
            signer,
            keyStore,
            fee,
            publicKeyHash,
            [{address: destination, tokenid, amount}],
            gas,
            storage,
        ).catch(err => {
            const errorMsg = JSON.stringify({name: err.message, ...err});
            console.log(
                `transferThunk/MultiAssetTokenHelper failed with ${errorMsg}}`,
            );
            dispatch(setMessage('Started token transaction failed.', 'error'));
            return undefined;
        });

        dispatch(
            setMessage(
                `Successfully started token transaction. ${operationId}`,
                'info',
            ),
        );
    };
}

export const getNFTCollection = async (
    tokenMapId: number,
    managerAddress: string,
    node: any,
) => {
    const {conseilUrl, apiKey, network} = node;

    console.log('node', node);

    let collectionQuery = ConseilQueryBuilder.blankQuery();
    collectionQuery = ConseilQueryBuilder.addFields(
        collectionQuery,
        'key',
        'value',
        'operation_group_id',
    );
    collectionQuery = ConseilQueryBuilder.addPredicate(
        collectionQuery,
        'big_map_id',
        ConseilOperator.EQ,
        [tokenMapId],
    );
    collectionQuery = ConseilQueryBuilder.addPredicate(
        collectionQuery,
        'key',
        ConseilOperator.STARTSWITH,
        [`Pair 0x${TezosMessageUtils.writeAddress(managerAddress)}`],
    );
    collectionQuery = ConseilQueryBuilder.addPredicate(
        collectionQuery,
        'value',
        ConseilOperator.EQ,
        [0],
        true,
    );
    collectionQuery = ConseilQueryBuilder.setLimit(collectionQuery, 10000);

    const collectionResult = await TezosConseilClient.getTezosEntityData(
        {url: conseilUrl, apiKey, network},
        network,
        'big_map_contents',
        collectionQuery,
    );

    const operationGroupIds = collectionResult.map(r => r.operation_group_id);
    const queryChunks = chunkArray(operationGroupIds, 30);
    const priceQueries = queryChunks.map(c => makeLastPriceQuery(c));

    const priceMap: any = {};
    await Promise.all(
        priceQueries.map(
            async q =>
                await TezosConseilClient.getTezosEntityData(
                    {url: conseilUrl, apiKey, network},
                    network,
                    'operations',
                    q,
                ).then(result =>
                    result.map(row => {
                        let amount = 0;
                        const action = row.parameters_entrypoints;

                        if (action === 'collect') {
                            amount = Number(
                                row.parameters
                                    .toString()
                                    .replace(/^Pair ([0-9]+) [0-9]+/, '$1'),
                            );
                        } else if (action === 'transfer') {
                            amount = Number(
                                row.parameters
                                    .toString()
                                    .replace(
                                        /[{] Pair \"[1-9A-HJ-NP-Za-km-z]{36}\" [{] Pair \"[1-9A-HJ-NP-Za-km-z]{36}\" [(]Pair [0-9]+ [0-9]+[)] [}] [}]/,
                                        '$1',
                                    ),
                            );
                        }

                        priceMap[row.operation_group_hash] = {
                            price: new BigNumber(row.amount),
                            amount,
                            timestamp: row.timestamp,
                            action,
                        };
                    }),
                ),
        ),
    );

    const collection = collectionResult.map(row => {
        let price = 0;
        let receivedOn = new Date();
        let action = '';

        try {
            const priceRecord = priceMap[row.operation_group_id];
            price = priceRecord.price
                .dividedToIntegerBy(priceRecord.amount)
                .toNumber();
            receivedOn = new Date(priceRecord.timestamp);
            action =
                priceRecord.action === 'collect' ? 'Purchased' : 'Received';
        } catch {
            //
        }

        return {
            piece: row.key.toString().replace(/.* ([0-9]{1,}$)/, '$1'),
            amount: Number(row.value),
            price: isNaN(price) ? 0 : price,
            receivedOn,
            action,
        };
    });

    console.log('collection', collection);

    return collection.sort(
        (a, b) => b.receivedOn.getTime() - a.receivedOn.getTime(),
    );
};

function makeLastPriceQuery(operations: any) {
    let lastPriceQuery = ConseilQueryBuilder.blankQuery();
    lastPriceQuery = ConseilQueryBuilder.addFields(
        lastPriceQuery,
        'timestamp',
        'amount',
        'operation_group_hash',
        'parameters_entrypoints',
        'parameters',
    );
    lastPriceQuery = ConseilQueryBuilder.addPredicate(
        lastPriceQuery,
        'kind',
        ConseilOperator.EQ,
        ['transaction'],
    );
    lastPriceQuery = ConseilQueryBuilder.addPredicate(
        lastPriceQuery,
        'status',
        ConseilOperator.EQ,
        ['applied'],
    );
    lastPriceQuery = ConseilQueryBuilder.addPredicate(
        lastPriceQuery,
        'internal',
        ConseilOperator.EQ,
        ['false'],
    );
    lastPriceQuery = ConseilQueryBuilder.addPredicate(
        lastPriceQuery,
        'operation_group_hash',
        operations.length > 1 ? ConseilOperator.IN : ConseilOperator.EQ,
        operations,
    );
    lastPriceQuery = ConseilQueryBuilder.setLimit(
        lastPriceQuery,
        operations.length,
    );

    return lastPriceQuery;
}

export async function getNFTObjectDetails(tezosUrl: string, objectId: number) {
    const packedNftId = TezosMessageUtils.encodeBigMapKey(
        Buffer.from(TezosMessageUtils.writePackedData(objectId, 'int'), 'hex'),
    );
    const nftInfo = await TezosNodeReader.getValueForBigMapKey(
        tezosUrl,
        514,
        packedNftId,
    );
    const ipfsUrlBytes = JSONPath({
        path: '$.args[1][0].args[1].bytes',
        json: nftInfo,
    })[0];
    const ipfsHash = Buffer.from(ipfsUrlBytes, 'hex').toString().slice(7);

    const nftDetails = await fetch(
        `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
        {cache: 'no-store'},
    );
    const nftDetailJson = await nftDetails.json();

    const nftName = nftDetailJson.name;
    const nftDescription = nftDetailJson.description;
    const nftCreators = nftDetailJson.creators
        .map((c: any) => c.trim())
        .map(
            (c: any) => `${c.slice(0, 6)}...${c.slice(c.length - 6, c.length)}`,
        )
        .join(', '); // TODO: use names where possible
    const nftArtifact = `https://cloudflare-ipfs.com/ipfs/${nftDetailJson.formats[0].uri
        .toString()
        .slice(7)}`;
    const nftArtifactType = nftDetailJson.formats[0].mimeType.toString();

    return {
        name: nftName,
        description: nftDescription,
        creators: nftCreators,
        artifactUrl: nftArtifact,
        artifactType: nftArtifactType,
    };
}
