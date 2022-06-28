import * as React from 'react';
import {useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    NativeModules,
    Linking,
    TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';

import SafeContainer from '../../components/SafeContainer';
import CustomHeader from '../../components/CustomHeader';

import {BeaconProps} from '../../screens/types';
import {State} from '../../reducers/types';
import {BeaconPermissionScopes} from '../types';

const BeaconInfo = ({navigation}: BeaconProps) => {
    const isFocused = navigation.isFocused();
    const permissions = useSelector(
        (state: State) => state.beacon.beaconPermissions,
    );
    const metadata = useSelector((state: State) => state.beacon.beaconMetadata);
    const isReady = useSelector((state: State) => state.beacon.beaconReady);

    const onPressLearnMore = async () => {
        await Linking.openURL('https://www.walletbeacon.io/');
    };

    const onPressScanQrCode = () =>
        navigation.navigate('BeaconConnectionRequest');

    const onPressBack = () => navigation.navigate('Account');

    useEffect(() => {}, [permissions, metadata]);

    useEffect(() => {
        if (!isFocused) {
            return;
        }
        NativeModules.BeaconBridge.getPermissions();
        NativeModules.BeaconBridge.getPeers();
        NativeModules.BeaconBridge.getAppMetadata();
    }, [isFocused]);

    return (
        <View style={s.container}>
            <SafeContainer>
                <CustomHeader onBack={onPressBack} />
                <Text style={permissions.length ? s.title : [s.title, s.top]}>
                    dApps connected using Beacon
                </Text>
                {!permissions.length && (
                    <View style={s.center}>
                        <Text style={s.h1}>
                            You haven’t connected to any dApps yet.
                        </Text>
                        <View style={s.description}>
                            <Text style={s.p}>
                                Beacon allows you interact with web-based dApps
                                using your Tezos account. Once you start making
                                connections with dApps that support Beacon, they
                                will show up here!{' '}
                                <Text style={s.link} onPress={onPressLearnMore}>
                                    Learn more
                                </Text>
                            </Text>
                        </View>
                        {isReady && (
                            <TouchableOpacity
                                style={s.scan}
                                onPress={onPressScanQrCode}>
                                <Text>Scan QR Code</Text>
                            </TouchableOpacity>
                        )}
                        {!isReady && (
                            <Text style={s.unavailable}>
                                Beacon service is unavailable. Please try again
                                later.
                            </Text>
                        )}
                    </View>
                )}
                {!!permissions.length && isReady && (
                    <View style={s.center}>
                        <TouchableOpacity
                            style={s.scan}
                            onPress={onPressScanQrCode}>
                            <Text>Scan QR Code</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {!!permissions.length &&
                    isReady &&
                    permissions.map((permission: any, idx: number) => (
                        <View style={s.item} key={idx}>
                            <View style={[s.row, s.section]}>
                                <Text>Connected</Text>
                                <Text>
                                    {new Date(
                                        permission.connectedAt,
                                    ).toLocaleString()}
                                </Text>
                            </View>
                            <View style={[s.row, s.section]}>
                                <Text>Permissions</Text>
                                <View style={s.row}>
                                    {permission.scopes.map(
                                        (
                                            scope: BeaconPermissionScopes,
                                            index: number,
                                        ) => (
                                            <Text key={scope}>
                                                {`${
                                                    BeaconPermissionScopes[
                                                        scope
                                                    ]
                                                }${
                                                    index <
                                                    permission.scopes.length - 1
                                                        ? ', '
                                                        : ''
                                                }`}
                                            </Text>
                                        ),
                                    )}
                                </View>
                            </View>
                            <View style={[s.row, s.section]}>
                                <Text>Network</Text>
                                <Text>{permission.network.type}</Text>
                            </View>
                            <View style={[s.row, s.section]}>
                                <Text>Name</Text>
                                <Text>{permission.appMetadata.name}</Text>
                            </View>
                        </View>
                    ))}
            </SafeContainer>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    center: {
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    top: {
        marginTop: 100,
    },
    h1: {
        marginTop: 80,
        fontSize: 16,
    },
    description: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    p: {
        fontSize: 16,
        lineHeight: 24,
    },
    link: {
        fontWeight: 'bold',
    },
    img: {
        marginTop: 40,
    },
    scan: {
        marginTop: 40,
        backgroundColor: '#fcd104',
        padding: 20,
        borderRadius: 20,
    },
    unavailable: {
        marginTop: 40,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    section: {
        paddingHorizontal: 40,
        marginTop: 10,
    },
    item: {
        marginTop: 30,
    },
});

export default BeaconInfo;
