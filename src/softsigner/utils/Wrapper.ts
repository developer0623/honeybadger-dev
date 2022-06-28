/* eslint-disable prettier/prettier */
import sodium from 'react-native-sodium';
import {Buffer} from 'buffer';

export const keys = async (seed: Buffer) => {
    return await sodium.crypto_sign_seed_keypair(seed.toString('base64'));
};

export const sign = async (message: Buffer, key: Buffer) => {
    return await sodium.crypto_sign_detached(
        message.toString('base64'),
        key.toString('base64'),
    );
};

export const publickey = async (sk: Buffer) => {
    const seed = await sodium.crypto_sign_ed25519_sk_to_seed(
        sk.toString('base64'),
    );
    return await sodium.crypto_sign_seed_keypair(seed);
};

export const pwhash = async (passphrase: string, salt: Buffer) => {
    return await sodium.crypto_pwhash(sodium.crypto_pwhash_SALTBYTES, passphrase, salt.toString('base64'), 4, 33554432, sodium.crypto_pwhash_ALG_ARGON2I13);
};

export const open = async (nonce_and_ciphertext: Buffer, key: string) => {
    const nonce = nonce_and_ciphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES);
    const ciphertext = nonce_and_ciphertext.slice(sodium.crypto_secretbox_NONCEBYTES);

    return await sodium.crypto_secretbox_open_easy(ciphertext.toString('base64'), nonce.toString('base64'), key);
};

export const salt = async () => {
    return await sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
};

export const nonce = async () => {
    return await sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
};

export const close = async (message: Buffer, nonceBuf: Buffer, key: string) => {
    return await sodium.crypto_secretbox_easy(message.toString('base64'), nonceBuf.toString('base64'), key);
};
