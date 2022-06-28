/* eslint-disable prettier/prettier */
import {Signer, SignerCurve, TezosMessageUtils} from 'conseiljs';

import * as CryptoUtils from './utils/CryptoUtils';
import {Buffer} from 'buffer';

export default class SoftSigner implements Signer {
    readonly _secretKey: Buffer;
    private _isEncrypted: boolean;
    private _salt: Buffer;

    constructor(secretKey: Buffer, isEncrypted: boolean = false, salt?: Buffer) {
        this._secretKey = secretKey;
        this._isEncrypted = isEncrypted;
        this._salt = salt ? salt : Buffer.alloc(0);
    }

    public getSignerCurve(): SignerCurve {
        return SignerCurve.ED25519;
    }

    public static async createSigner(secretKey: Buffer, password: string = ''): Promise<Signer> {
        if (password.length > 0) {
            const salt = await CryptoUtils.generateSaltForPwHash();
            const encryptedKey = await CryptoUtils.encryptMessage(secretKey, password, salt);
            return new SoftSigner(encryptedKey, true, salt);
        }

        return new SoftSigner(secretKey);
    }

    public async getKey(password: string = '') {
        if (this._isEncrypted && password.length > 0) {
            return await CryptoUtils.decryptMessage(this._secretKey, password, this._salt);
        }

        return this._secretKey;
    }

    public async signOperation(bytes: Buffer, password: string = ''): Promise<Buffer> {
        return await CryptoUtils.signDetached(TezosMessageUtils.simpleHash(bytes, 32), await this.getKey(password));
    }

    public async signText(message: string, password: string = ''): Promise<string> {
        const messageSig = await CryptoUtils.signDetached(Buffer.from(message, 'utf8'), await this.getKey(password));

        return TezosMessageUtils.readSignatureWithHint(messageSig, 'edsig');
    }

    /**
     * * Convenience function that uses Tezos nomenclature to sign arbitrary text. This method produces a 32-byte blake2s hash prior to signing.
     *
     * @param message UTF-8 text
     * @returns {Promise<string>} base58check-encoded signature prefixed with 'edsig'
     */
    public async signTextHash(message: string, password: string = ''): Promise<string> {
        const messageSig = await this.signOperation(Buffer.from(message, 'utf8'), password);

        return TezosMessageUtils.readSignatureWithHint(messageSig, 'edsig');
    }
}
