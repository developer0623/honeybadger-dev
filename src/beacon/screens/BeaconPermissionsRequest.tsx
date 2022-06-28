import {View} from 'native-base';
import * as React from 'react';
import {Text, StyleSheet, TouchableOpacity, NativeModules} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import SafeContainer from '../../components/SafeContainer';

import {setBeaconLoading} from '../../reducers/beacon/actions';

import {BeaconProps} from '../../screens/types';
import {State} from '../../reducers/types';

const displayScopes: Record<string, string> = {
    operation_request: 'Operation Request',
    sign: 'Sign',
};

const BeaconPermissionsRequest = ({navigation}: BeaconProps) => {
    const dispatch = useDispatch();
    const publicKey = useSelector((state: State) => state.app.publicKey);
    const beaconMessage = useSelector(
        (state: State) => state.beacon.beaconMessage,
    );
    const beaconLoading = useSelector(
        (state: State) => state.beacon.beaconLoading,
    );

    const onCancel = () => {
        navigation.navigate('Account');
    };

    const onAuthorize = async () => {
        try {
            dispatch(setBeaconLoading(true));
            NativeModules.BeaconBridge.sendResponse(publicKey);
        } catch (e) {
            console.log('Failed to authorize');
            dispatch(setBeaconLoading());
        }
    };

    return (
        <View style={s.container}>
            <SafeContainer>
                {beaconLoading && (
                    <View style={s.loading}>
                        <Text>Loading...</Text>
                    </View>
                )}
                <Text style={s.title}>Permissions Request</Text>
                <Text
                    style={[
                        s.network,
                        s.p1,
                    ]}>{`Network: ${beaconMessage.network.type}`}</Text>
                <Text
                    style={[
                        s.message,
                        s.p2,
                    ]}>{`${beaconMessage.appMetadata.name} is requesting the following permissions:`}</Text>
                <View style={s.permissions}>
                    {beaconMessage?.scopes?.length &&
                        beaconMessage.scopes.map((item: string) => (
                            <View style={s.item} key={item}>
                                <View style={s.dot} />
                                <Text style={s.itemText}>
                                    {displayScopes[item]}
                                </Text>
                            </View>
                        ))}
                </View>
                <Text style={[s.info]}>
                    Always make sure you trust the sites you interact with.
                </Text>
                <View style={s.buttons}>
                    <TouchableOpacity onPress={onCancel} style={s.btn}>
                        <Text style={s.btnTxt}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onAuthorize}
                        style={[s.btn, s.btnBg]}>
                        <Text style={[s.btnTxt, s.whiteTxt]}>Authorize</Text>
                    </TouchableOpacity>
                </View>
            </SafeContainer>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    permissions: {
        marginTop: 30,
        paddingHorizontal: 50,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4B4B4B',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    itemText: {
        fontFamily: 'Roboto',
        fontWeight: '300',
        fontSize: 14,
        lineHeight: 22,
        marginLeft: 8,
        color: '#000000',
    },
    title: {
        fontFamily: 'Roboto',
        fontSize: 24,
        textAlign: 'center',
        color: '#323232',
        marginTop: 30,
    },
    p1: {
        fontFamily: 'Roboto',
        fontWeight: '300',
        fontSize: 16,
        lineHeight: 19,
        color: '#323232',
    },
    p2: {
        fontFamily: 'Roboto',
        fontSize: 18,
        lineHeight: 19,
        color: '#323232',
    },
    network: {
        marginTop: 100,
        textAlign: 'center',
    },
    address: {
        marginTop: 4,
        textAlign: 'center',
    },
    message: {
        marginTop: 32,
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    info: {
        fontFamily: 'Roboto',
        fontWeight: '300',
        fontSize: 16,
        lineHeight: 19,
        color: '#323232',
        marginTop: 150,
        paddingHorizontal: 24,
        textAlign: 'center',
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginTop: 'auto',
        marginBottom: 40,
    },
    btn: {
        width: 156,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#979797',
    },
    btnBg: {
        backgroundColor: '#4B4B4B',
    },
    btnTxt: {
        fontFamily: 'Roboto',
        fontSize: 16,
        lineHeight: 19,
        color: '#0F0C02',
    },
    whiteTxt: {
        color: 'white',
    },
    loading: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default BeaconPermissionsRequest;
