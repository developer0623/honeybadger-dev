import React, {useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {StyleSheet, Platform, TextInput, KeyboardAvoidingView} from 'react-native';
import {Container, Text, Input, View, Button, Box, Center, HStack} from 'native-base';

import EnterAddressErrors from '../components/EnterAddress/EnterAddressErrors';

import constants from '../utils/constants.json';
import {setSendAmount} from '../reducers/app/actions';
import CustomHeader from '../components/CustomHeader';
import CustomIcon from '../components/CustomIcon';
import {truncateHash} from '../utils/general';
import {formatAmount, utezToTez} from '../utils/currency';
import {colors} from '../theme';

import {State} from '../reducers/types';
import {SendAmountProps} from './types';

const SendAmount = ({navigation}: SendAmountProps) => {
    const dispatch = useDispatch();
    const address = useSelector((state: State) => state.app.sendAddress);
    const balance = useSelector((state: State) => state.app.balance);
    const [amount, setAmount] = useState('');
    const [currency] = useState('0');
    const [fee] = useState(utezToTez(constants.fees.simpleTransaction));
    const title = `Sending to ${truncateHash(address)}`;
    const textInput = useRef(null);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onChange = (value: string) => {
        if (!!value && value.length === 1 && value.charAt(0) === '.') {
            setAmount('0.');
            setIsError(false);
            return;
        }

        if (!!value && value.indexOf('.') > -1 && value.split('.')[1].length > 3) {
            setIsError(false);
            return;
        }

        if (isNaN(Number(value))) {
            setIsError(true);
            setErrorMessage('Please enter a valid number');
            setAmount(value);
            return;
        }

        if (Number(value) * 1000000 >= balance) {
            setIsError(true);
            setErrorMessage('Insufficient balance');
            setAmount(value);
            return;
        }

        setIsError(false);
        setAmount(value);
    };

    const onKeyPress = (e: any) => {
        const value = e.nativeEvent.key;
        if (e.nativeEvent.key === 'Backspace') {
            const val = amount.length > 1 ? amount.slice(0, amount.length - 1) : '';
            setAmount(val);
            return;
        }

        if (!Number(value) && value !== '.') {
            return;
        }

        const newValue = amount + value;
        onChange(newValue);
    };

    const goNext = () => {
        if (!amount.length || Number(amount) === 0 || isError) {
            return;
        }

        dispatch(setSendAmount(Number(amount) * 1000000)); // TODO: const
        navigation.navigate('SendReview');
    };

    return (
        <Box style={styles.container}>
            <CustomHeader
                title="Enter Amount"
                onBack={() => navigation.goBack()}
                onClose={() => navigation.navigate('Account')}
            />
            <Text style={styles.title}>{title}</Text>
            {Platform.OS === 'android' && (
                <View style={styles.input}>
                    <TextInput
                        autoFocus={true}
                        value={amount}
                        onKeyPress={onKeyPress}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        ref={textInput}
                    />
                </View>
                )}
                {Platform.OS === 'ios' && (
                    <Input
                        autoFocus
                        style={styles.input}
                        value={amount}
                        onChangeText={onChange}
                        keyboardType="numeric"
                    />
                )}
            {/* <View style={styles.amount}>
                <Text style={styles.typo1}>
                    {formatAmount(Number(amount) * 1000000)}
                </Text>
                <CustomIcon name="XTZ" size={30} color="#1a1919" />
            </View> */}
            <HStack justifyContent="center" alignItems="center">
                <Text fontSize="3xl">{formatAmount(Number(amount) * 1000000)}</Text>
                <CustomIcon name="XTZ" size={30} color="#1a1919" />
            </HStack>
            <View style={styles.errorContainer}>
                <EnterAddressErrors isVisible={isError} title="Invalid Amount" message={errorMessage} />
            </View>
            {/*<View style={styles.currency}>
                <Text style={styles.typo2}>$</Text>
                <Text style={styles.typo2}>{currency}</Text>
            </View>*/}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={styles.details}>
                    <View style={styles.row}>
                        {/*<Text style={[styles.useMax, styles.typo3]}>Use Max</Text>*/}
                        <View style={[styles.row, styles.available]}>
                            <Text style={[styles.availableText, styles.typo4]}>
                                Available
                            </Text>
                            <Text style={styles.typo4}>
                                {formatAmount(balance)}
                            </Text>
                            <CustomIcon name="XTZ" size={16} color="#343434" />
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}>
                        <Text style={[styles.fee, styles.typo5]}>
                            {`Operation fee ${fee}`}
                        </Text>
                        <CustomIcon name="XTZ" size={16} color="#7d7c7c" />
                    </View>
                    <Button style={styles.button} onPress={goNext}>
                        <Text style={styles.typo6}>Next</Text>
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
        height: '100%'
    },
    title: {
        marginTop: 5,
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'center',
    },
    amount: {
        // marginTop: -230,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'red',
        height: 80,
        paddingVertical: 0
    },
    input: {
        opacity:0
    },
    currency: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    details: {
        marginTop: 93.5,
        backgroundColor: '#ffffff',
        flexGrow: 1,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        padding: 26,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    useMax: {
        width: '30%',
    },
    available: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    availableText: {
        marginRight: 5,
    },
    fee: {
        marginTop: 4,
        textAlign: 'right',
    },
    button: {
        marginTop: 48,
        width: 213,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
    },
    typo1: {
        fontFamily: 'Roboto-Medium',
        fontWeight: '500',
        fontSize: 36,
    },
    typo2: {
        fontFamily: 'Roboto-Medium',
        fontSize: 27,
        fontWeight: '500',
        color: '#1a1919',
    },
    typo3: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.67,
        color: '#2900db',
    },
    typo4: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        fontWeight: 'normal',
        color: '#343434',
    },
    typo5: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#7d7c7c',
    },
    typo6: {
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.85,
        textTransform: 'capitalize',
        color: 'white'
    },
    errorContainer: {
        height: 70
    }
});

export default SendAmount;
