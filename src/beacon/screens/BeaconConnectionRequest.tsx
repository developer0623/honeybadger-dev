import {View} from 'native-base';
import * as React from 'react';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, StyleSheet, TouchableOpacity, NativeModules} from 'react-native';
import {RNCamera} from 'react-native-camera';
import bs58check from 'bs58check';

import SafeContainer from '../../components/SafeContainer';
import CustomHeader from '../../components/CustomHeader';

import {setBeaconLoading} from '../../reducers/beacon/actions';

import {State} from '../../reducers/types';
import {BeaconProps} from '../../screens/types';

interface displayDataProps {
    //PeerInfo
    id: string;
    type: string;
    name: string;
    version: string;
    publicKey: string;
    relayServer: string;
}

const BeaconConnectionRequest = ({navigation}: BeaconProps) => {
    const dispatch = useDispatch();
    const beaconLoading = useSelector(
        (state: State) => state.beacon.beaconLoading,
    );
    const [showCamera, setShowCamera] = useState(true);
    const [scanData, setScanData] = useState<displayDataProps | null>(null);
    const [error, setError] = useState('');

    const onBarcodeRecognized = ({data}: {data: string}) => {
        if (data && data.length) {
            const parsedData = JSON.parse(
                bs58check.decode(
                    data.slice(data.indexOf('data=') + 'data='.length),
                ),
            );
            setScanData(parsedData);
            setShowCamera(false);
        }
    };

    const onCancel = () => {
        navigation.navigate('Account');
        setShowCamera(false);
        setScanData(null);
        setError('');
    };

    const onConnect = async () => {
        try {
            if (scanData === null) {
                return;
            }
            dispatch(setBeaconLoading(true));
            NativeModules.BeaconBridge.addPeer(
                scanData.id,
                scanData.name,
                scanData.publicKey,
                scanData.relayServer,
                scanData.version,
            );
        } catch (e) {
            dispatch(setBeaconLoading());
            // TODO: set and display error message
            console.log('Failed to add peer');
        }
    };

    const btn = {
        size: 30,
        color: '#ffffff',
    };

    return (
        <>
            {showCamera && (
                <RNCamera
                    captureAudio={false}
                    onBarCodeRead={onBarcodeRecognized}
                    style={s.camera}>
                    <CustomHeader
                        onBack={onCancel}
                        leftIconName="Cancel"
                        backIconCustomStyles={btn}
                    />
                </RNCamera>
            )}
            {!showCamera && scanData && (
                <View style={s.container}>
                    <SafeContainer>
                        {beaconLoading && (
                            <View style={s.loading}>
                                <Text>Loading...</Text>
                            </View>
                        )}
                        <Text style={s.title}>Connection Request</Text>
                        <Text style={[s.network, s.p1]}>{scanData?.name}</Text>
                        <Text style={[s.address, s.p1]}>
                            {scanData.publicKey}
                        </Text>
                        <Text
                            style={[
                                s.message,
                                s.p2,
                            ]}>{`${scanData.name} would like to connect to your account`}</Text>
                        <Text style={[s.info]}>
                            This site is requesting access to view your account
                            address. Always make sure you trust the sites you
                            interact with.
                        </Text>
                        <View style={s.buttons}>
                            <TouchableOpacity onPress={onCancel} style={s.btn}>
                                <Text style={s.btnTxt}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onConnect}
                                style={[s.btn, s.btnBg]}>
                                <Text style={[s.btnTxt, s.whiteTxt]}>
                                    Connect
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </SafeContainer>
                </View>
            )}
        </>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    camera: {
        flex: 1,
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
        paddingHorizontal: 24,
    },
    address: {
        marginTop: 4,
        textAlign: 'center',
        paddingHorizontal: 24,
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

export default BeaconConnectionRequest;
