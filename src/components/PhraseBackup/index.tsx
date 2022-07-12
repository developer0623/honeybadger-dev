/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef, Ref} from 'react';
import {StyleSheet, TextInput, ScrollView, Alert, Modal} from 'react-native';
import {View, Text, Container, Button} from 'native-base';
import {useSelector} from 'react-redux';
import * as Keychain from 'react-native-keychain';

import {colors} from '../../theme';
import CustomHeader from '../CustomHeader';
import {State} from '../../reducers/types';
import PhraseBackupSuccess from './PhraseBackupSuccess';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const PhraseBackup = (props: any) => {
    

    const seed = useSelector((state: State) => state.app.seed);
    const [step, setStep] = useState('VERIFY');
    const [back, setBack] = useState(false);
    const [phraseInputs, setPhraseInputs] = useState([{key: 0, value: ''}]);
    const [modalVisible, setModalVisible] = useState(false);
    const inputRefs:any = useRef([]);

    useEffect(() => {
        generateNewPhrases();
    }, [seed]);

    const generatePhrases = () => {
        const arr = seed.split(' ');
        if (arr.length > 1) {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            setPhraseInputs(shuffled.slice(0, 4).map(w => { return { key: arr.indexOf(w), value: '' }; }).sort((a, b) => a.key - b.key));
        }
    }

    const onInputChange = (text: any, index: number, actualIndex: any) => {
        let data: any = phraseInputs.map((item, arrIndex) => {
            if (arrIndex == index) {
                return { ...item, value: text };
            } else {
                return item;
            }
        });

        setPhraseInputs(data);
    }

    const validatePhrase = async () => {
        const seedWords = seed.split(' ');
        const match = phraseInputs.reduce((o, i) => {
            return o && seedWords[i.key] === i.value.toLowerCase() 
        }, true);

        if (match) {
            let data: any= await Keychain.getInternetCredentials('securitySetup');
            if (data) {
                data = JSON.parse(data.password);
                const setup = {
                    securitySetup: data.securitySetup,
                    isBiometric: data.isBiometric,
                    pin: data.pin,
                    phraseBackedUp: true,
                    phraseBackedUpFirst: data.phraseBackedUpFirst,
                }
                await Keychain.setInternetCredentials('securitySetup', 'userName', JSON.stringify(setup));
            } else {
                const setupData = {
                    securitySetup: false,
                    isBiometric: false,
                    pin: '',
                    phraseBackedUpFirst: true,
                    phraseBackedUp: true
                }

                await Keychain.setInternetCredentials('securitySetup', 'userName', JSON.stringify(setupData));
            }

            setStep('SUCCESS');
        } else {
            setModalVisible(true);
        }
    }

    const generateNewPhrases = () => {
        setModalVisible(false);
        generatePhrases();
    }

    const handleNext = (index: number) => {
        if (inputRefs.current[index+1]) {
            inputRefs.current[index+1].focus()
        } else {
            validatePhrase();
        }
    }

    return (
        <React.Fragment>
            {
                step !== "SUCCESS" &&
                <CustomHeader
                    title="Back up Recovery Phrase"
                    onBack={() => props.navigation.goBack()}
                />
            }
            {
                step === "VERIFY" &&
                <KeyboardAwareScrollView>
                    <View style={styles.content}>
                        <Text style={styles.typo1}>
                        To verify that you have backed up your recovery phrase, Please type in the following four words.
                        </Text>
                        {
                            phraseInputs.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Text style={styles.typo2}>Word {item.key + 1}</Text>
                                        <TextInput ref={(el: any) => (inputRefs.current[index] = el)} returnKeyType={index !== 3 ? 'next' : 'done'} autoFocus={index === 0 ? true : false} style={styles.inputField} placeholder={`Recovery phrase word ${item.key + 1}`} value={item.value}
                                        onChangeText={text => {
                                            onInputChange(text, index, item);
                                        }}
                                        onSubmitEditing={() => handleNext(index)}
                                        />
                                    </React.Fragment> 
                                )
                            })
                        }
                        <Button style={styles.btn} onPress={validatePhrase}>
                            <Text style={{color: 'white'}}>Submit</Text>
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
            }
            {
                step === "SUCCESS" &&
                <PhraseBackupSuccess navigation={props.navigation} />
            }
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Oops! Incorrect order</Text>
                        <Text style={styles.typo2}> Please enter your recovery phrase again to ensure you have written it down correctly .</Text>
                        <Button style={styles.modalBtn} onPress={generateNewPhrases}>
                            <Text style={{color: 'white'}}>Try Again</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
    },
    content: {
        backgroundColor: '#ffffff',
        flexGrow: 1,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingHorizontal: 30,
        paddingBottom: 50
    },
    btn: {
        width: 256,
        height: 50,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 30
    },
    typo1: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 26,
        paddingTop:30,
        paddingBottom:30,
    },
    typo2: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 18,
        color:'#343434',
        marginBottom:10,
        textAlign:'center'
    },
    inputField: {
        padding:13,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius:12,
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        fontWeight: '300',
        marginBottom:30,
        lineHeight: 24,
        color: '#4D4D4D'
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
        width: '80%',
        elevation: 5,
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
        width: 150,
        height: 50,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 0
    }
});

export default PhraseBackup;