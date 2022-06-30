import React, {useEffect, useState} from 'react';
import { Box, Container, Text, View, Button } from 'native-base';
import { StyleSheet } from 'react-native';
import TouchID from "react-native-touch-id";

import Checkmark from '../../../assets/checkmark.svg';

const EnableBiometric = (props: any) => {
    const [isSuccess, setSuccess] = useState(props.success ? true : false);
    const [isBiometricSupported, setBiometricSupported] = useState(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

    const handleBiometric = () => {
        props.enableBiometric();
        setIsBiometricEnabled(true);
        setSuccess(true);
    }

    useEffect(() => {
        async function load() {
            try {
                await TouchID.isSupported().then((biometryType: any) => {
                    if(biometryType) {
                        setBiometricSupported(true);
                    } else {
                        setBiometricSupported(false);
                    }
                })
            } catch(error) {
                setBiometricSupported(false);
            }
        }

        load();
    }, [])

    return (
        <Box>
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <View style={styles.icon}>
                        <Checkmark />
                    </View>
                    { 
                        isBiometricEnabled ?
                        <Text style={styles.title}>App Lock Enabled with Biometrics &amp; Pin</Text>
                        :
                        <Text style={styles.title}>App Lock Enabled with a Pin</Text>
                    }
                    <Text style={styles.paragraph}>Every extra protective measure you take matters. It's all part of being a responsible crypto owner.</Text>
                </View>
                {
                    !isSuccess && isBiometricSupported &&
                    <React.Fragment>
                        <Button style={styles.btn} onPress={handleBiometric}>
                            <Text style={styles.typo3}>Enable Biometrics</Text>
                        </Button>
                        <Text style={{marginBottom: 40}} onPress={props.skipBiometric}>Go to wallet</Text>
                    </React.Fragment>
                }
                {
                    (isSuccess ||  !isBiometricSupported) &&
                    <React.Fragment>
                        <Button style={styles.btn} onPress={props.skipBiometric}>
                            <Text style={styles.typo3}>Go to wallet</Text>
                        </Button>
                        <Text style={{marginBottom: 40}}></Text>
                    </React.Fragment>
                }
            </View>
        </Box>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        borderTopWidth: 200,
        borderTopColor: '#FAD049',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'white',
        width: '110%'
    },
    container: {
        backgroundColor: '#FFF',
        flex: .8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        textAlign: 'center',
        margin: 40,
        marginTop: -180,
        borderRadius: 10,
        shadowColor: 'rgba(31, 31, 31, 0.77)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5
        //boxShadow: 'rgba(31, 31, 31, 0.77) 1px 7px 33px -24px'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: -10, // hack
        marginRight: -10,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    paragraph: {
        fontWeight: '400',
        fontSize: 16,
        marginTop: 20
    },
    btn: {
        width: 256,
        height: 50,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
        marginBottom: 20,
    },
    typo3: {
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.85,
        textTransform: 'capitalize',
        color: 'white'
    },
    icon: {
        width: 81,
        height: 65,
        marginBottom: 10
    },
});

export default EnableBiometric;