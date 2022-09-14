/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Modal} from 'react-native';
import {Container, Box, Center, Button, Text, View} from 'native-base';
import {KeyStoreUtils} from '../softsigner';
import SeedInput from '../components/SeedInput';
import CustomHeader from '../components/CustomHeader';
import RecoveryOption from '../components/RecoveryOptions';
import { getAccountInfo } from '../reducers/app/thunks';
import * as Keychain from 'react-native-keychain';
import {setKeysAction} from '../reducers/app/actions';
import {useDispatch} from 'react-redux';
import bip39 from 'react-native-bip39';

import {splitHash} from '../utils/general';
import {AccountProps} from './types';
import {colors} from '../theme';

const RestoreAccount = ({navigation}: AccountProps) => {
    const [step, setStep] = useState(1);
    const [mnemonic, setMnemonic] = useState('');
    const [password, setPassword] = useState('');
    const [derivationPath, setDerivationPath] = useState('');
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [recoveredAddress, setRecoveredAddress] = useState('');
    const [isAccountNotFound, setAccountNotFound] = useState(false);
    const [identityData, setIdentity]: any = useState({});
    const dispatch = useDispatch();

    const handleSeeds = async (seeds: string) => {
        if (bip39.validateMnemonic(seeds.trim().toLowerCase())) {
            setMnemonic(seeds.trim().toLowerCase());
            setStep(2);
        } else {
            setErrorText("Invalid mnemonic");
            setErrorModalVisible(true);
        }
    }

    const handleRecovery = async (options: any) => {
        setPassword(options.password);
        setDerivationPath(options.derivationPath);
        let identity: any = {};
        try {
            identity = await KeyStoreUtils.restoreIdentityFromMnemonic(mnemonic, password, '', derivationPath);
        } catch (error) {
            setErrorText(error.message);
            setErrorModalVisible(true);
            return false;
        }

        setIdentity(identity);
        setRecoveredAddress(identity.publicKeyHash);
        setInfoModalVisible(true);
    }

    const recoverAccount = async () => {
        if (identityData.publicKeyHash) {
            const account = await getAccountInfo(identityData.publicKeyHash).catch(
                () => false
            );
            const termsDate = new Date().toLocaleString();
            setInfoModalVisible(false); 
            if (!account) {
                const title = 'Account does not exists. We will create a new account for you.';
                setErrorText(title);
                setErrorModalVisible(true);
                setAccountNotFound(true);
            } else {
                await Keychain.resetGenericPassword();
                await Keychain.setGenericPassword('newwallet', JSON.stringify({...identityData, termsDate}));

                const setup = {
                    securitySetup: false,
                    isBiometric: false,
                    pin: '',
                    phraseBackedUp: true,
                    phraseBackedUpFirst: true,
                };
                await Keychain.setInternetCredentials('securitySetup', 'userName', JSON.stringify(setup));

                dispatch(setKeysAction(identityData));
                navigation.replace('AccountSetup');
            }
        } else {
            setInfoModalVisible(false); 
            setErrorText('Unable to recover address.');
            setErrorModalVisible(true);
            setAccountNotFound(true);
        }
    };

    const closeErrorModal = async() => {
        setErrorModalVisible(false);
        setErrorText('');
        if (isAccountNotFound) {
            const termsDate = new Date().toLocaleString();
            const keys = await KeyStoreUtils.generateIdentity();
            await Keychain.resetGenericPassword();
            await Keychain.setGenericPassword('newwallet', JSON.stringify({...keys, termsDate}));
            dispatch(setKeysAction(keys));
            setTimeout(() => {
                navigation.replace('AccountSetup');
            }, 100);
        }
    };

    let addressParts = splitHash(recoveredAddress);

    return (
        <>
            <Center style={styles.yellowContainer}>
                <CustomHeader
                    title="Recovery Phrase"
                    onBack={() => step === 1 ? navigation.replace('Welcome') : setStep(1)}
                />
                {step === 1 &&
                    <SeedInput onChange={handleSeeds}/>
                }

                {step === 2 &&
                    <RecoveryOption onChange={handleRecovery}/>
                }
            </Center>
            <Modal
                animationType="fade"
                transparent={true}
                visible={errorModalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Error</Text>
                        <Text style={styles.typo2}>{errorText}</Text>
                        <Button style={styles.modalBtn} onPress={closeErrorModal}>
                            <Text style={{color: 'white'}}>Close</Text>
                        </Button>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={infoModalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Continue to recover address?</Text>
                        <View style={styles.address}>
                            {(addressParts).map((item, i) => (
                                <Text
                                    style={
                                        !(i === 0 || i === addressParts.length - 1)
                                            ? [
                                                styles.addressItem,
                                                styles.addressItemMiddle,
                                            ]
                                            : styles.addressItem
                                    }>
                                    {item}
                                </Text>
                            ))}
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Button style={styles.btn} variant="unstyled" onPress={() => setInfoModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </Button>
                            <Button style={styles.modalBtn} onPress={recoverAccount}>
                                <Text style={{color: 'white'}}>Proceed</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    yellowContainer: {
        backgroundColor: colors.bg,
        width: '100%',
    },
    typo2: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 18,
        color: '#343434',
        marginBottom: 10,
        textAlign: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 26,
        padding: 28,
        alignItems: "center",
        width: '90%',
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    modalText: {
        marginBottom: 16,
        textAlign: "center",
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '500',
        color: '#E3787D',
    },
    modalBtn: {
        width: 130,
        height: 50,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 0,
        marginLeft: 10
    },
    address: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        width: 200
    },
    addressItem: {
        paddingHorizontal: 2,
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        fontWeight: '500'
    },
    addressItemMiddle: {
        color: '#979797'
    },
    btn: {
        width: 130,
        height: 50,
        borderColor: '#4b4b4b',
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 0,
        marginLeft: 10
    },
    accept: {
        backgroundColor: '#4b4b4b',
    },
    acceptText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.85,
        color: '#ffffff'
    },
    cancelText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        letterSpacing: 0.85,
        color: '#4b4b4b'
    },
});
export default RestoreAccount;