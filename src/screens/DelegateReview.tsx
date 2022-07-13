import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {StyleSheet} from 'react-native';
import {Container, Box, View} from 'native-base';

import LinkIcon from '../../assets/link-icon.svg';

import {sendDelegation} from '../reducers/app/thunks';
import Review from '../components/Review';
import CustomHeader from '../components/CustomHeader';
import {State} from '../reducers/types';
import {colors} from '../theme';
import constants from '../utils/constants.json';

import {DelegateReviewProps} from './types';

const DelegateReview = ({navigation}: DelegateReviewProps) => {
    const dispatch = useDispatch();
    const publicKeyHash = useSelector(
        (state: State) => state.app.publicKeyHash,
    );
    const address = useSelector((state: State) => state.app.delegateAddress);
    const delegation = useSelector((state: State) => state.app.delegation);
    let info = '';

    const onSend = () => {
        dispatch(sendDelegation());
        navigation.replace('Account');
    };

    if (delegation.length > 0) {
        info = 'Deposits from the new baker should start in about 35 days';
    }

    return (
        <Box style={styles.container}>
            <CustomHeader
                title="Review Delegation"
                onBack={() => navigation.goBack()}
                onClose={() => navigation.navigate('Account')}
            />
            <Review
                fromTitle="My Account"
                from={publicKeyHash}
                toTitle="To Baker’s Service"
                to={address}
                fee={constants.fees.delegation}
                actionTitle="Tap to Delegate"
                info={info}
                onSend={onSend}>
                <View style={styles.icon}>
                    <LinkIcon />
                </View>
            </Review>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
    },
    icon: {
        width: 89,
        height: 89,
        borderWidth: 2,
        borderColor: colors.bg,
        borderRadius: 44.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default DelegateReview;
