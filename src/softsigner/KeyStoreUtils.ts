import {
    KeyStore,
    KeyStoreCurve,
    KeyStoreType,
    TezosMessageUtils,
} from 'conseiljs';
import {Buffer} from 'buffer';

import bip39 from 'react-native-bip39';
import * as CryptoUtils from './utils/CryptoUtils';

export async function generateIdentity(
    strength = 256,
    password = '',
    mnemonic = '',
) {
    return restoreIdentityFromMnemonic(
        mnemonic || (await bip39.generateMnemonic(strength)),
        password,
    );
}

export async function generateKeys(seed: Buffer) {
    const keys = await CryptoUtils.generateKeys(seed);
    return {publicKey: keys.publicKey, secretKey: keys.privateKey};
}

export async function restoreIdentityFromMnemonic(
    mnemonic = '',
    password = '',
    pkh = '',
    derivationPath = '',
) {
    if (![12, 15, 18, 21, 24].includes(mnemonic.split(' ').length)) {
        throw new Error('Invalid mnemonic length.');
    }
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('The given mnemonic could not be validated.');
    }

    const seed = (await bip39.mnemonicToSeed(mnemonic, password)).slice(0, 32);
    const keys = await generateKeys(seed);

    const secretKey = TezosMessageUtils.readKeyWithHint(
        Buffer.from(keys.secretKey, 'hex'),
        'edsk',
    );
    const publicKey = TezosMessageUtils.readKeyWithHint(
        Buffer.from(keys.publicKey, 'hex'),
        'edpk',
    );
    const publicKeyHash = TezosMessageUtils.computeKeyHash(
        Buffer.from(keys.publicKey, 'hex'),
        'tz1',
    );

    if (!!pkh && publicKeyHash !== pkh) {
        throw new Error(
            'The given mnemonic and passphrase do not correspond to the supplied public key hash',
        );
    }

    return {
        publicKey,
        secretKey,
        publicKeyHash,
        curve: KeyStoreCurve.ED25519,
        storeType: KeyStoreType.Mnemonic,
        seed: mnemonic,
        derivationPath,
    };
}

export async function recoverKeys(
    secretKey: Buffer,
): Promise<{publicKey: Buffer; secretKey: Buffer}> {
    const keys = await CryptoUtils.recoverPublicKey(secretKey);
    return {publicKey: keys.publicKey, secretKey: keys.privateKey};
}

export async function restoreIdentityFromSecretKey(
    secretKey: string,
): Promise<KeyStore> {
    const secretKeyBytes = TezosMessageUtils.writeKeyWithHint(
        secretKey,
        'edsk',
    );
    const keys = await recoverKeys(secretKeyBytes);
    const publicKey = TezosMessageUtils.readKeyWithHint(
        Buffer.from(keys.publicKey, 'hex'),
        'edpk',
    );
    const publicKeyHash = TezosMessageUtils.computeKeyHash(
        keys.publicKey,
        'tz1',
    );
    return {
        publicKey,
        secretKey,
        publicKeyHash,
        curve: KeyStoreCurve.ED25519,
        storeType: KeyStoreType.Mnemonic,
    };
}
