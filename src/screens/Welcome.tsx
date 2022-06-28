import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {Container, Text, Button, View, Box} from 'native-base';
import * as Keychain from 'react-native-keychain';
import {useDispatch} from 'react-redux';

import {setKeysAction} from '../reducers/app/actions';
import TouchID from 'react-native-touch-id';

import SafeContainer from '../components/SafeContainer';
import PinCode from '../components/PinCode';

import Logo from '../../assets/galleon-logo.svg';
import Cryptonomic from '../../assets/cryptonomic-icon.svg';
import Wave from '../../assets/splash-wave-shadow.svg';

import {WelcomeProps} from './types';

const Welcome = ({navigation}: WelcomeProps) => {
    const dispatch = useDispatch();
    const [isAccountPresent, setIsAccountPresent] = useState(false);
    const [isPinEnabled, setIsPinEnabled] = useState(false);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
    const [isPin, setIsPin] = useState(false);

    useEffect(() => {
        async function load() {
            let keys: any;
            let securityConfig: any;

            try {
                keys = await Keychain.getGenericPassword();
                if (keys) {
                    setIsAccountPresent(true);
                    dispatch(setKeysAction(JSON.parse(keys.password)));
                }
            } catch (error) {
                console.log(
                    'Account information not found in the Keychain',
                    error,
                );
            }

            try {
                // const keychainData: any = await Keychain.getInternetCredentials('securitySetup'); // TODO: use GenericPassword
                // securityConfig = JSON.parse(keychainData.password);

                // if (securityConfig.hasOwnProperty('securitySetup') && securityConfig.securitySetup) {
                //     setIsPinEnabled(true);
                // }

                // await TouchID.isSupported().then((biometryType: any) => {
                //     console.log(biometryType)
                //     if (biometryType === 'FaceID' || biometryType === 'TouchID') {
                //         setIsBiometricSupported(true);
                //     }
                //     setIsBiometricEnabled(securityConfig.isBiometric);
                // }).catch((error) => {
                //     setIsBiometricSupported(false);
                //     setIsBiometricEnabled(false);
                // });
            } catch (error) {
                console.log('Security configuration not found in the Keychain', error);
            }

            if (keys !== false && (securityConfig === undefined || !securityConfig.securitySetup)) {
                navigation.replace('Account');
                return;
            }

            if (securityConfig !== undefined && securityConfig.isBiometric) {
                showAppLock();
            }
        }

        load();
    }, [dispatch, navigation]);

    const getStarted = () => { navigation.replace('Terms') };

    const showAppLock = () => {
        TouchID.isSupported()
            .then((biometryType: any) => {
                const optionalConfigObject = {
                    title: 'Authentication Required', // Android
                    imageColor: '#e00606', // Android
                    imageErrorColor: '#ff0000', // Android
                    sensorDescription: 'Touch sensor', // Android
                    sensorErrorDescription: 'Failed', // Android
                    cancelText: 'Cancel', // Android
                    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
                    unifiedErrors: false, // use unified error messages (default false)
                    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
                };
                return TouchID.authenticate("", optionalConfigObject)
                .then((success: any) => {
                    // Alert.alert('Authenticated Successfully NEW');
                    navigation.replace('Account');
                })
                .catch((error: any) => {
                    //  Do noting as user has cancelled the biometric auth
                    console.log("Touch is not available");
                });
            })
            .catch(error => {
                // Do noting as user has cancelled the biometric auth
                console.log("Touch is not available");
            });
    }

    const showPin = () => {
        setIsPin(true);
    }

    const handlePin = async(pinEntered: string) => {
        let data: any= await Keychain.getInternetCredentials('securitySetup');
        data = JSON.parse(data.password);
        if (data.pin === pinEntered) {
            //setIsPin(false);
            navigation.replace('Account');
        } else {
            setIsPin(false);
            Alert.alert("Incorrect PIN.");
        }
    }

    const redirectToResetPin = () => {
        navigation.replace("ResetPin");
    }

    return (
        !isPin ?
        <Box>
            <View style={styles.waveBg} />
            <SafeContainer>
                <View style={styles.wave}>
                    <Wave />
                </View>
                <View style={styles.logo}>
                    <Logo />
                </View>
                <View style={styles.bottom}>
                    <View style={styles.item}>
                        <View style={styles.text}>
                            <Text style={styles.typo1}>A product of</Text>
                            <Cryptonomic style={styles.logoCrytponomic} />
                            <Text style={styles.typo2}>Cryptonomic Inc</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        {
                            (isAccountPresent && isPinEnabled) &&
                            <React.Fragment>
                                <Button style={styles.btn} onPress={showPin}>
                                    <Text style={styles.typo3}>Enter Pin</Text>
                                </Button>
                                <Text style={{marginTop: 20}} onPress={() => navigation.replace('ResetPin')}>Reset Pin</Text>
                                {
                                    (isBiometricSupported && isBiometricEnabled) &&
                                    <Button style={styles.btn} onPress={showAppLock}>
                                        <Text style={styles.typo3}>Use Biometrics</Text>
                                    </Button>
                                }
                            </React.Fragment>
                        }
                        {
                            (!isAccountPresent) &&
                            <React.Fragment>
                                <Button style={styles.btn} onPress={() => navigation.replace('RestoreAccount')}>
                                    <Text style={styles.typo3}>Restore Account</Text>
                                </Button>
                                <Button style={styles.btnWhite} onPress={getStarted}>
                                    <Text style={styles.typo3White}>Create New Account</Text>
                                </Button>
                            </React.Fragment>
                        }
                    </View>
                </View>
            </SafeContainer>
        </Box>
        :
        <Container>
            <PinCode key="pin" text='Please Enter Your Pin' handlePin={handlePin} isResetNeeded={false} isSkipAllowed={false} allowChange={true} redirectToResetPin={redirectToResetPin}/>
        </Container>
    );
};

const styles = StyleSheet.create({
    waveBg: {
        backgroundColor: '#fcd104',
        width: '100%',
        height: '30%',
        position: 'absolute',
    },
    wave: {
        position: 'absolute',
        width: '100%',
        height: '70%',
    },
    logo: {
        height: '55%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        justifyContent: 'center',
        flex: 1,
    },
    item: {
        marginTop: 25,
        alignItems: 'center',
    },
    btn: {
        width: 256,
        height: 50,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
        marginTop: 10
    },
    btnWhite: {
        width: 256,
        height: 50,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#4b4b4b'
    },
    text: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoCrytponomic: {
        marginHorizontal: 5,
    },
    typo1: {
        fontFamily: 'Roboto-Light',
        fontSize: 16,
        fontWeight: '300',
        letterSpacing: 0.13,
        color: 'rgb(80, 80, 80)',
    },
    typo2: {
        fontFamily: 'Roboto-Light',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.13,
        color: 'rgb(80, 80, 80)',
    },
    typo3: {
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.85,
        textTransform: 'capitalize',
    },
    typo3White: {
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.85,
        textTransform: 'capitalize',
        color: '#4b4b4b'
    }
});

export default Welcome;
