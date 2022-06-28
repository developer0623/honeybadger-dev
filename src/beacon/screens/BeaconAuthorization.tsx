import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import SafeContainer from '../../components/SafeContainer';

import {State} from '../../reducers/types';
import {BeaconProps} from '../../screens/types';

import getBeaconTemplate from '../';

const BeaconAuthorization = ({navigation}: BeaconProps) => {
    const {operationDetails, network} = useSelector(
        (state: State) => state.beacon.beaconMessage,
    );
    const {destination} = operationDetails[0];
    const {type} = network;
    const Template = getBeaconTemplate(destination);

    return (
        <View style={s.container}>
            <SafeContainer>
                <Text style={s.title}>{`Authorize ${type} Operation`}</Text>
                <Template navigation={navigation} />
            </SafeContainer>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    title: {
        alignSelf: 'center',
        fontFamily: 'Roboto',
        fontSize: 24,
        color: '#323232',
        marginTop: 30,
    },
});

export default BeaconAuthorization;
