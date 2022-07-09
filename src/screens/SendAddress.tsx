import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet} from 'react-native';
import {Container, Box, View, Button, Text} from 'native-base';

import {setSendAddress} from '../reducers/app/actions';

import EnterAddress from '../components/EnterAddress';
import {colors} from '../theme';
import {validateBakerAddress} from '../reducers/app/thunks';
import {State, Operation} from '../reducers/types';
import {SendAddressProps} from './types';
import CustomIcon from '../components/CustomIcon';

const SendAddress = ({navigation}: SendAddressProps) => {
    const transactions = useSelector((state: State) => state.app.transactions);
    const publicKeyHash = useSelector((state: State) => state.app.publicKeyHash);
    const [isValidAddress, setValidAddress] = useState(false);
    const [address, setAddress] = React.useState('');
    const dispatch = useDispatch();

    const goNext = () => {
        const isSomeSendTransaction = transactions.find(
            (t: Operation) =>
                t.source === publicKeyHash && Number(t.amount) > 0,
        );
        navigation.navigate(
            isSomeSendTransaction ? 'SendAmount' : 'SendFirstTime',
        );
    };

    const onValidAddress = (value: string, valid: boolean) => {
        setAddress(value);
        dispatch(setSendAddress(value));
        setValidAddress(valid);
    };

    return (
        <Box style={styles.container}>
            <EnterAddress
                headerTitle="Send"
                addressTitle="Enter Recipient Address"
                goBack={() => navigation.goBack()}
                validateAddress={(to) => validateBakerAddress(to, publicKeyHash)}
                onValidAddress={onValidAddress}>
                {isValidAddress && (
                <View style={styles.bakerDetails}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <CustomIcon name="Checkmark" size="25" color="#f5942a" />
                            <View>
                                <Text>Recepient Address</Text>
                                <Text>{address}</Text>
                            </View>
                        </View>
                        <Button style={styles.nextButton} onPress={goNext}>
                            <Text style={styles.typo2}>Next</Text>
                        </Button>
                    </View>
                </View>)}
            </EnterAddress>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
        height: '100%'
    },
    bakerDetails: {
        width: '90%',
        marginTop: 24,
        marginHorizontal: 24,
        flexDirection: 'column',
        borderStyle: 'solid',
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 15.5,
        padding: 12,
    },
    nextButton: {
        marginLeft: 'auto',
        width: 128,
        height: 50,
        backgroundColor: '#4b4b4b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    typo2: {
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        fontWeight: '300',
        lineHeight: 30,
        textTransform: 'capitalize',
        color: 'white'
    }
});

export default SendAddress;
