/* eslint-disable prettier/prettier */
import * as wrapper from './Wrapper';
import {Buffer} from 'buffer';

export async function generateSaltForPwHash() : Promise<Buffer> {
    const s = await wrapper.salt();
    return Buffer.from(s);
}

export async function encryptMessage(message: Buffer, passphrase: string, salt: Buffer) : Promise<Buffer> {
    const keyBytes = await wrapper.pwhash(passphrase, salt);
    const n = await wrapper.nonce();
    const nonce = Buffer.from(n);
    const s = await wrapper.close(message, nonce, keyBytes);
    const cipherText = Buffer.from(s);

    return Buffer.concat([nonce, cipherText]);
}

export async function decryptMessage(message: Buffer, passphrase: string, salt: Buffer) : Promise<Buffer> {
    const keyBytes = await wrapper.pwhash(passphrase, salt);
    const m = await wrapper.open(message, keyBytes);
    return Buffer.from(m);
}

export async function generateKeys(seed: Buffer) {
    const k = await wrapper.keys(seed);
    return {
        privateKey: Buffer.from(k.sk, 'base64'),
        publicKey: Buffer.from(k.pk, 'base64'),
    };
}

export async function signDetached(
    payload: Buffer,
    secretKey: Buffer,
): Promise<Buffer> {
    const b = Buffer.from(await wrapper.sign(payload, secretKey), 'base64');
    return Buffer.from(b);
}

export async function recoverPublicKey(secretKey: Buffer) {
    const k = await wrapper.publickey(secretKey);
    return {
        privateKey: Buffer.from(k.sk, 'base64'),
        publicKey: Buffer.from(k.pk, 'base64'),
    };
}
