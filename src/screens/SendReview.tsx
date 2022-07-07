import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {StyleSheet} from 'react-native';
import {Container, Text, View, Box, HStack} from 'native-base';

import {sendTransaction} from '../reducers/app/thunks';
import Review from '../components/Review';
import CustomHeader from '../components/CustomHeader';
import CustomIcon from '../components/CustomIcon';
import {formatAmount} from '../utils/currency';
import {colors} from '../theme';
import {State} from '../reducers/types';
import constants from '../utils/constants.json';

import {SendReviewProps} from './types';

const SendReview = ({navigation}: SendReviewProps) => {
    const dispatch = useDispatch();
    const publicKeyHash = useSelector(
        (state: State) => state.app.publicKeyHash,
    );
    const address = useSelector((state: State) => state.app.sendAddress);
    const amount = useSelector((state: State) => state.app.sendAmount);

    const onSend = () => {
        dispatch(sendTransaction());
        navigation.replace('Account');
    };

    return (
        <Box style={styles.container}>
            <CustomHeader
                title="Review Transaction"
                onBack={() => navigation.goBack()}
                onClose={() => navigation.navigate('Account')}
            />
            <Review
                fromTitle="From My Account"
                from={publicKeyHash}
                toTitle="To Recipient"
                to={address}
                fee={constants.fees.simpleTransaction}
                actionTitle="Tap to Send"
                onSend={onSend}>
                <Text style={styles.reviewAmountTitle}>Amount</Text>
                {/* <View style={styles.reviewAmount}>
                    <Text style={styles.typo1}>{formatAmount(amount)}</Text>
                    <CustomIcon name="XTZ" size={30} color="#1a1919" />
                </View> */}
                <HStack justifyContent="center" alignItems="center">
                    <Text fontSize="4xl">{formatAmount(amount)}</Text>
                    <CustomIcon name="XTZ" size={30} color="#1a1919" />
                </HStack>
            </Review>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
    },
    reviewAmountTitle: {
        color: '#343434',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        fontWeight: 'normal',
    },
    reviewAmount: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    typo1: {
        fontFamily: 'Roboto-Medium',
        fontSize: 36,
        fontWeight: '500',
        color: '#1a1919',
    },
});

export default SendReview;
