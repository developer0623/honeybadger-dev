import React, { useState } from 'react';
import { StatusBar, StyleSheet, Clipboard, ScrollView } from 'react-native';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import { Box, View, Text } from 'native-base';
import QRCode from 'react-native-qrcode-svg';

import CustomButton from '../components/CustomButton';
import CustomIcon from '../components/CustomIcon';
import CustomHeader from '../components/CustomHeader';
import CustomTooltip from '../components/CustomTooltip';
import { splitHash } from '../utils/general';

import { State } from '../reducers/types';
import { ReceiveProps } from './types';

const Receive = ({ navigation }: ReceiveProps) => {
    const address = useSelector((state: State) => state.app.publicKeyHash);
    const [copied, setCopied] = useState(false);
    const addressParts = splitHash(address);
    const onCopyToClipboard = () => {
        Clipboard.setString(address);
        setCopied(true);
    };
    const onShare = async () => {
        try {
            await Share.open({
                message: address,
                title: 'Share to',
            });
        } catch (e) {
            console.log('[ERROR_SHARE]', e);
        }
    };
    return (
        <Box style={styles.container}>
            <StatusBar backgroundColor="#fcd104" barStyle='light-content' />
            <CustomHeader title="Receive" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.main}>
                    <Text style={styles.title}>
                        Share your account address to receive XTZ or Tezos tokens
                    </Text>
                    <View style={styles.qr}>
                        <QRCode value={address} size={199} />
                    </View>
                    <View style={styles.address}>
                        {addressParts.map((item, i) => (
                            <Text
                                style={
                                    !(i === 0 || i === addressParts.length - 1)
                                        ? [
                                            styles.addressItem,
                                            styles.addressItemMiddle,
                                        ]
                                        : styles.addressItem
                                } key={`address${i}`}>
                                {item}
                            </Text>
                        ))}
                    </View>
                    <View style={styles.actions}>
                        <View>
                            <CustomTooltip
                                isVisible={copied}
                                content={
                                    <View style={styles.tooltipContent}>
                                        <CustomIcon name="Checkmark" size={16} />
                                        <Text style={styles.tooltipText}>
                                            Copied to the clipboard
                                        </Text>
                                    </View>
                                }
                                onClose={() => setCopied(false)}>
                                <CustomButton
                                    icon="Copy"
                                    label="Copy"
                                    onPress={onCopyToClipboard}
                                />
                            </CustomTooltip>
                        </View>
                        <View style={styles.line} />
                        <View>
                            <CustomButton
                                icon="Share-Android"
                                label="Share"
                                onPress={onShare}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    tooltipArrow: {
        display: 'none',
    },
    tooltipContent: {
        width: 'auto',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    tooltipText: {
        marginLeft: 5,
    },
    container: {
        backgroundColor: '#fcd104',
    },
    main: {
        marginTop: 20,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        flexGrow: 1,
    },
    title: {
        marginTop: 61,
        width: 292,
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        fontWeight: '500',
    },
    qr: {
        marginTop: 40,
        minWidth: 249,
        minHeight: 249,
        marginHorizontal: 80,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'rgb(232, 232, 232)',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    address: {
        marginTop: 55,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    addressItem: {
        paddingHorizontal: 2,
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        fontWeight: '500',
    },
    addressItemMiddle: {
        color: '#979797',
    },
    actions: {
        marginTop: 'auto',
        marginBottom: 42,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    line: {
        width: 1,
        backgroundColor: '#e8e8e8',
        marginHorizontal: 50,
    },
});

export default Receive;
