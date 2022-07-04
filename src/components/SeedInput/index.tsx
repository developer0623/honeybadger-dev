/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, Ref } from 'react';
import { StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { View, Text, Container, Button } from 'native-base';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';

import { colors } from '../../theme';
import CustomHeader from '../CustomHeader';


const SeedInput = (props: any) => {
    const [seeds, setSeeds] = useState('');
    const handleSeeds = () => {
        props.onChange(seeds)
    }

    const isBtnDisabled = () => {
        const seedsArray = seeds.trim().split(" ");
        if ([12, 15, 18, 21, 24].includes(seedsArray.length)) {
            return false;
        }

        return true;
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <SafeAreaView style={styles.areaContainer}>
                    <View style={styles.content}>
                        <Text style={styles.typo1}>
                            Enter your recovery phrase in the correct order to restore your account.
                        </Text>
                        <React.Fragment>
                            <TextInput style={styles.inputField} multiline={true} numberOfLines={6} autoFocus={true} onChangeText={(text): any => setSeeds(text)} />
                        </React.Fragment>
                        <Button style={isBtnDisabled() ? styles.btnDisabled : styles.btn} onPress={handleSeeds} disabled={isBtnDisabled()}>
                            <Text style={{ color: 'white' }}>Continue</Text>
                        </Button>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </ScrollView>
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
    },
    areaContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
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
    btnDisabled: {
        width: 256,
        height: 50,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        opacity: .6,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 30
    },
    typo1: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 26,
        paddingTop: 30,
        paddingBottom: 30,
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
    inputField: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 12,
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        fontWeight: '300',
        marginBottom: 30,
        lineHeight: 24,
        color: '#4D4D4D',
        textAlignVertical: 'top',
        padding: 10
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

export default SeedInput;