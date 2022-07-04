/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {AccountSettingsProps} from './types';
import { Box, Container, Center } from 'native-base';
import { StyleSheet, Alert } from "react-native";
import * as Keychain from 'react-native-keychain';

import CustomHeader from '../components/CustomHeader';
import PinCode from '../components/PinCode';
import EnableBiometric from '../components/EnableBiometric';
import {colors} from '../theme';

const AccountSetup = ({ navigation, route }: AccountSettingsProps) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [step, setStep] = useState('PIN');
    const [back, setBack] = useState(true);
    const [skip, setSkip] = useState(false);

    useEffect(() => {
        if(!!route.params && !!route.params.fromSetting && route.params.fromSetting)
            setSkip(false)
        else setSkip(true)
    }, [])

    const handlePin = (pinCode: string) => {
        setPin(pinCode);
        setStep('CONFIRM_PIN');
    }

    const handleConfirmPin = async (pinCode: string) => {
        if (pin !== pinCode) {
            Alert.alert("Pin and confirm pin did not match");
        } else {
            let data: any= await Keychain.getInternetCredentials('securitySetup');
            if(data) {
                data = JSON.parse(data.password);
            }
            
            const setup = {
                securitySetup: true,
                isBiometric: false,
                pin: pin,
                phraseBackedUpFirst: data.phraseBackedUpFirst ? data.phraseBackedUpFirst : false,
                phraseBackedUp: data.phraseBackedUp ? data.phraseBackedUp : false
            }
            await Keychain.setInternetCredentials('securitySetup', 'userName', JSON.stringify(setup));
            setConfirmPin(pin);
            // Disable back btn
            setBack(false);
            setStep('ENABLE_BIOMETRIC');
        }
    }

    const setBiometric = async() => {
        let data: any= await Keychain.getInternetCredentials('securitySetup');
        data = JSON.parse(data.password);
        const setup = {
            securitySetup: true,
            isBiometric: true,
            pin: data.pin,
            phraseBackedUpFirst: data.phraseBackedUpFirst,
            phraseBackedUp: data.phraseBackedUp
        }
        await Keychain.setInternetCredentials('securitySetup', 'userName', JSON.stringify(setup));
    }

    const skipBiometric = () => {
        navigation.replace('Account');
    }

    const backFunc = () => {
        if ( navigation.canGoBack() ) {
            navigation.goBack()
        }
    }

    return (
        <Box style={styles.containerWrapper}>
        {
            back ?
            <CustomHeader title="Enable App Lock" onBack={() => backFunc()} />
            :
            <CustomHeader title="Enable App Lock" />
        }
            <Center>
            {
                step === "PIN" &&
                <PinCode key="pin" text='Please Choose a 6 Digit Pin' handlePin={handlePin} isResetNeeded={true} isSkipAllowed={skip} skipBiometric={skipBiometric} />
            }
            {
                step === "CONFIRM_PIN" &&
                <PinCode key="confirm-pin" text='Please Confirm Your Pin' handlePin={handleConfirmPin} isResetNeeded={true} isSkipAllowed={false} />
            }
            {
                step === "ENABLE_BIOMETRIC" &&
                <EnableBiometric enableBiometric={setBiometric} skipBiometric={skipBiometric}/>
            }
            </Center>
        </Box>
    )
}

const styles = StyleSheet.create({
    containerWrapper: {
        backgroundColor: colors.bg,
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingHorizontal: 20,
    },
    containerFlex: {
      alignItems: 'center',
      flexDirection:'row'
    },
    title: {
      fontSize: 18,
      marginBottom:40,
    },
    input: {
      fontSize:36,
      borderWidth: 2,
      borderTopColor:'#fff',
      borderLeftColor:'#fff',
      borderRightColor:'#fff',
      width:20,
      margin:15,
      height: 25,
    },
    noBorder: {
        fontSize:36,
        borderWidth: 0,
        borderTopColor:'transparent',
        borderLeftColor:'transparent',
        borderRightColor:'transparent',
        width:20,
        margin:15,
        height: 25
    },
    circle: {
        width:20,
        height: 20,
        margin:15,
        backgroundColor: '#000',
        borderRadius: 50
    }
  });

export default AccountSetup;
