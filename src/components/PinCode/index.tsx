/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useReducer } from 'react';
import { StyleSheet, View, TextInput, KeyboardAvoidingView, Platform, SafeAreaView, Image } from "react-native";
import { Box, Container, Center, Text } from 'native-base';

import { colors } from '../../theme';

import Logo from '../../../assets/galleon-logo.svg';

const PinCode = (props: any) => {
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);
    const input5Ref = useRef(null);
    const input6Ref = useRef(null);

    const [state, setState] = useReducer(
        (state: any, newState: any) => ({ ...state, ...newState }),
        { input1: '', input2: '', input3: '', input4: '', input5: '', input6: '', pinCodePosition: 1, pin: '' }
    )

    const onChangePin = (pinCode: any, position: number) => {
        pinCode = pinCode.charAt(0);

        // To make sure that all previous positions are filled
        const tmpPosition = position;
        for (let i = position; i > 1; i--) {
            if (!state[`input${position - 1}`]) {
                position = position - 1;
            }
        }

        if (tmpPosition !== position) {
            setState({ [`input${position}`]: pinCode, [`input${tmpPosition}`]: '' });
        }

        allowAutoFocus(position)

        const newPin = `${state.pin}${pinCode}`;
        if (position === 6) {
            // redirect to next screen
            props.isResetNeeded && resetForm();
            props.handlePin(newPin)
        } else {
            setState({ pin: newPin, pinCodePosition: position + 1 });
            allowAutoFocus(position + 1);
        }
    }

    const resetForm = () => {
        setState({ input1: '', input2: '', input3: '', input4: '', input5: '', input6: '', pinCodePosition: 1, pin: '' })
    }

    const getPinStyle = function (position: number) {
        if (position < state.pinCodePosition) {
            return styles.noBorder;
        }
        return styles.input
    }

    const allowAutoFocus = (position: number) => {
        switch (position) {
            case 1:
                input1Ref.current && input1Ref.current.focus();
                break;
            case 2:
                input2Ref.current && input2Ref.current.focus();
                break;
            case 3:
                input3Ref.current && input3Ref.current.focus();
                break;
            case 4:
                input4Ref.current && input4Ref.current.focus();
                break;
            case 5:
                input5Ref.current && input5Ref.current.focus();
                break;
            case 6:
                input6Ref.current && input6Ref.current.focus();
                break
        }
    }

    const handleBackspace = (key: string, position: number) => {
        if (key === 'Backspace') {
            const newPin = state.pin.slice(0, position - 2);
            setState({ pin: newPin });
            switch (position - 1) {
                case 1:
                    setState({ input1: '' });
                    // Hack to refresh multiple states
                    setTimeout(() => {
                        allowAutoFocus(1);
                        setState({ pinCodePosition: 1 });
                    }, 10);
                    break;
                case 2:
                    setState({ input2: '' });
                    // Hack to refresh multiple states
                    setTimeout(() => {
                        allowAutoFocus(2);
                        setState({ pinCodePosition: 2 });
                    }, 10);
                    break;
                case 3:
                    setState({ input3: '' });
                    // Hack to refresh multiple states
                    setTimeout(() => {
                        allowAutoFocus(3);
                        setState({ pinCodePosition: 3 });
                    }, 10);
                    break;
                case 4:
                    setState({ input4: '' });
                    // Hack to refresh multiple states
                    setTimeout(() => {
                        allowAutoFocus(4);
                        setState({ pinCodePosition: 4 });
                    }, 10);
                    break;
                case 5:
                    setState({ input5: '' });
                    // Hack to refresh multiple states
                    setTimeout(() => {
                        allowAutoFocus(5);
                        setState({ pinCodePosition: 5 });
                    }, 10);
                    break;
                case 6:
                    setState({ input6: '' });
                    // Hack to refresh multiple states
                    setTimeout(() => {
                        allowAutoFocus(6);
                        setState({ pinCodePosition: 6 });
                    }, 10);
                    break
            }
        }
    }

    return (
        <Box style={styles.containerWrapper}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View>
                    {
                        props.allowChange &&
                        <View style={styles.containerForgotPin}>
                            <Text onPress={() => props.redirectToResetPin()} style={styles.forgotPassword}>Forgot Pin?</Text>
                        </View>
                    }
                </View>
                <SafeAreaView style={styles.areaContainer}>
                    <View style={styles.container}>
                        <View style={styles.logo}>
                            <Logo />
                        </View>
                        <Text style={styles.title}>{props.text} </Text>
                        <View style={styles.containerFlex}>
                            {
                                state.input1 === '' ?
                                    <TextInput secureTextEntry={true}
                                        ref={input1Ref}
                                        caretHidden={true}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        autoFocus={true}
                                        style={getPinStyle(1)}
                                        value={state.input1}
                                        onChangeText={text => {
                                            setState({ input1: text.toString() });
                                            onChangePin(text, 1)
                                        }}
                                        onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, 1)}
                                    />
                                    :
                                    <Text style={styles.circle}></Text>
                            }

                            {
                                state.input2 === '' ?
                                    <TextInput secureTextEntry={true}
                                        ref={input2Ref}
                                        caretHidden={true}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        style={getPinStyle(2)}
                                        value={state.input2}
                                        onChangeText={text => {
                                            setState({ input2: text.toString() });
                                            onChangePin(text, 2)
                                        }}
                                        onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, 2)}
                                    />
                                    :
                                    <Text style={styles.circle}></Text>
                            }

                            {
                                state.input3 === '' ?
                                    <TextInput secureTextEntry={true}
                                        ref={input3Ref}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        caretHidden={true}
                                        style={getPinStyle(3)}
                                        value={state.input3}
                                        onChangeText={text => {
                                            setState({ input3: text.toString() });
                                            onChangePin(text, 3)
                                        }}
                                        onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, 3)}
                                    />
                                    :
                                    <Text style={styles.circle}></Text>
                            }

                            {
                                state.input4 === '' ?
                                    <TextInput secureTextEntry={true}
                                        ref={input4Ref}
                                        keyboardType="numeric"
                                        caretHidden={true}
                                        style={getPinStyle(4)}
                                        value={state.input4}
                                        onChangeText={text => {
                                            setState({ input4: text.toString() });
                                            onChangePin(text, 4)
                                        }}
                                        onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, 4)}
                                    />
                                    :
                                    <Text style={styles.circle}></Text>
                            }

                            {
                                state.input5 === '' ?
                                    <TextInput secureTextEntry={true}
                                        ref={input5Ref}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        caretHidden={true}
                                        style={getPinStyle(5)}
                                        value={state.input5}
                                        onChangeText={text => {
                                            setState({ input5: text.toString() });
                                            onChangePin(text, 5)
                                        }}
                                        onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, 5)}
                                    />
                                    :
                                    <Text style={styles.circle}></Text>
                            }

                            {
                                state.input6 === '' ?
                                    <TextInput
                                        ref={input6Ref}
                                        secureTextEntry={true}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        caretHidden={true}
                                        style={getPinStyle(6)}
                                        value={state.input6}
                                        onChangeText={text => {
                                            setState({ input6: text.toString() });
                                            onChangePin(text, 6)
                                        }}
                                        onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, 6)}
                                    />
                                    :
                                    <Text style={styles.circle}></Text>
                            }
                        </View>
                        {
                            props.isSkipAllowed &&
                            <View>
                                <Text style={{ marginTop: 50 }} onPress={props.skipBiometric}>Skip</Text>
                            </View>
                        }
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Box>
    )
}

const styles = StyleSheet.create({
    containerWrapper: {
        backgroundColor: colors.bg,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
        backgroundColor: colors.bg,
    },
    containerForgotPin: {
        backgroundColor: '#F9CC48',
        paddingRight: 35
    },
    areaContainer: {
        flex: 1
    },
    containerFlex: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: 18,
        marginBottom: 40,
    },
    input: {
        fontSize: 36,
        borderWidth: 2,
        borderTopColor: '#F9CC48',
        borderLeftColor: '#F9CC48',
        borderRightColor: '#F9CC48',
        width: 20,
        margin: 15,
        height: 25,
    },
    noBorder: {
        fontSize: 36,
        borderWidth: 0,
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        width: 20,
        margin: 15,
        height: 25
    },
    circle: {
        width: 20,
        height: 20,
        margin: 15,
        backgroundColor: '#000',
        borderRadius: 20 / 2,
        overflow: 'hidden'
    },
    logo: {
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    forgotPassword: {
        color: '#F5942A',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'right'
    }
});

export default PinCode;