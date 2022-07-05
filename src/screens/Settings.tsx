import React, { useLayoutEffect, useState } from 'react';
import { StatusBar, NativeModules, StyleSheet, Linking, ScrollView } from 'react-native';
import { Box, Text, View, Button, Container, Switch, HStack, ChevronRightIcon, CheckCircleIcon } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import * as Keychain from 'react-native-keychain';

import CustomHeader from '../components/CustomHeader';
import CustomIcon from '../components/CustomIcon';
import { colors } from '../theme';
import config from '../config';
import Success from '../../assets/success.svg';
import RightArrow from '../../assets/right-arrow.svg';
import { SettingsProps } from './types';

const Settings = ({ navigation }: SettingsProps) => {
    const [securitySetup, setSecuritySetup] = useState(false);
    const [phraseBackedup, setPhraseBackedup] = useState(false);
    const [SecurityLevel, setSecurityLevel] = useState("0");

    useLayoutEffect(() => {
        const loadInitialState = async () => {
            try {
                let data: any = await Keychain.getInternetCredentials('securitySetup');
                data = JSON.parse(data.password);

                if (data.hasOwnProperty('securitySetup') && data.securitySetup) {
                    setSecuritySetup(data.securitySetup)
                } else {
                    setSecuritySetup(false);
                }

                if (data.phraseBackedUp) {
                    setPhraseBackedup(true);
                }

                if (data) {
                    if (data.securitySetup && data.phraseBackedUp) {
                        setSecurityLevel("2");
                    } else if (data.securitySetup || data.phraseBackedUp) {
                        setSecurityLevel("1")
                    } else {
                        setSecurityLevel("0");
                    }

                } else {
                    setSecurityLevel("0");
                }
            } catch (error) {
                // error
            }
        };
        loadInitialState();
    }, []);

    const getSecurityLevelText = (securityLevel: string) => {
        if (securityLevel === "0") {
            return "Level 1: Goldfish";
        }

        if (securityLevel === "1") {
            return "Level 2: Savvy Salmon";
        }

        return "Level 3: Discreet Dolphin";
    }

    const onResetBeacon = () => {
        console.log('reset beacon')
        NativeModules.BeaconBridge.removePeers();
        NativeModules.BeaconBridge.removePermissions();
        NativeModules.BeaconBridge.removeAppMetadata();
    };

    const onClearData = () => {
        console.log('reset keystore')
        Keychain.resetGenericPassword();
        Keychain.resetInternetCredentials('securitySetup');
        navigation.navigate('Welcome');
    };

    const toggleAppLock = async () => {
        if (securitySetup) {
            let data: any = await Keychain.getInternetCredentials('securitySetup');
            data = JSON.parse(data.password);
            const setup = {
                securitySetup: false,
                isBiometric: false,
                pin: '',
                phraseBackedUp: data.phraseBackedUp
            }
            await Keychain.setInternetCredentials(
                'securitySetup',
                'userName',
                JSON.stringify(setup)
            );
            setSecuritySetup(false);
        } else {
            navigation.navigate('AccountSetup', { fromSetting: true });
        }
    }

    const list = [
        {
            title: 'App',
            items: [
                {
                    name: `Version: ${DeviceInfo.getVersion()}, build ${DeviceInfo.getBuildNumber()}`,
                },
                { name: `Network: ${config[0].displayNetwork}` },
            ],
        },
        {
            title: 'Security',
            items: [
                {
                    name: 'Security Level',
                    action: () => navigation.navigate('SecurityLevel'),
                },
                {
                    name: phraseBackedup ? 'Show Recovery Phrase' : 'Backup Recovery Phrase',
                    action: () => navigation.navigate('RecoveryPhrase', { fromSetting: true }),
                },
                {
                    name: 'Enable App Lock',
                    isSwitch: true,
                    action: () => navigation.navigate('AccountSetup'),
                },
            ],
        },
        {
            title: 'Reset',
            items: [
                {
                    name: 'Remove dApp Data',
                    action: () => onResetBeacon(),
                },
                {
                    name: 'Clear Account Data',
                    action: () => onClearData(),
                }
            ],
        },
        {
            title: 'Help',
            items: [
                {
                    name: 'FAQ',
                    action: () => {
                        Linking.openURL(
                            'https://cryptonomic.zendesk.com/hc/en-us/sections/360007678431-FAQ',
                        );
                    },
                }, // TODO: read from config
                {
                    name: 'Support',
                    action: () => {
                        Linking.openURL(
                            'https://cryptonomic.tech/support.html',
                        );
                    },
                }, // TODO: read from config
            ],
        },
        {
            title: 'Legal',
            items: [
                {
                    name: 'Terms and Conditions',
                    action: () => {
                        Linking.openURL(
                            'https://github.com/Cryptonomic/Deployments/raw/master/Terms_of_Service.pdf',
                        );
                    },
                }, // TODO: read from config
                {
                    name: 'Privacy Policy',
                    action: () => {
                        Linking.openURL(
                            'https://github.com/Cryptonomic/Deployments/raw/master/Privacy_Policy.pdf',
                        );
                    },
                }, // TODO: read from config
            ],
        },
    ];

    return (
        <Box style={styles.container}>
            <StatusBar backgroundColor="#fcd104" barStyle='light-content' />
            <CustomHeader title="Settings" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.content}>
                    {list.map(({ title, items }) => (
                        <View style={styles.section} key={title}>
                            <View style={styles.item}>
                                <View style={styles.title}>
                                    <Text style={styles.titleText}>{title}</Text>
                                </View>
                            </View>
                            {items.map(({ name, action, isSwitch }) => {
                                const children = (
                                    <HStack style={styles.lineOut}>
                                        <HStack>
                                            <Text style={styles.btnText}>
                                                {name}
                                            </Text>

                                            {name == 'Security Level' &&
                                                <Text style={styles.subTitle}>{getSecurityLevelText(SecurityLevel)}</Text>
                                            }

                                            {name == 'Backup Recovery Phrase' &&
                                                <Text style={styles.alertText}>Not backed up</Text>
                                            }

                                            {name == 'Show Recovery Phrase' &&
                                                <HStack style={{ alignItems: 'center' }}>
                                                    <Text style={styles.successText}>Backed up</Text>
                                                    <CheckCircleIcon />
                                                </HStack>
                                            }
                                        </HStack>

                                        <HStack>
                                            {action && (
                                                isSwitch ?
                                                    <Switch
                                                        trackColor={{ false: "#333333", true: "#0dbd8b" }}
                                                        thumbColor={true ? "#FFFFFF" : "#f4f3f4"}
                                                        ios_backgroundColor="#3e3e3e"
                                                        onValueChange={toggleAppLock}
                                                        value={securitySetup}
                                                    />
                                                    : <ChevronRightIcon />

                                            )}
                                        </HStack>
                                    </HStack>
                                );

                                return (
                                    <HStack style={styles.item} key={name}>
                                        {action ? (
                                            <Button
                                                variant="unstyled"
                                                style={styles.btn}
                                                onPress={action}>
                                                {children}
                                            </Button>
                                        ) : (
                                            <View style={styles.btn}>
                                                {children}
                                            </View>
                                        )}
                                    </HStack>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
    },
    content: {
        backgroundColor: '#ffffff',
        flexGrow: 1,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingHorizontal: 20,
    },
    title: {
        paddingBottom: 18,
        paddingHorizontal: 10,
    },
    section: {
        marginTop: 28,
    },
    item: {
        borderBottomWidth: 2,
        borderBottomColor: '#e6e4e4',
        flexDirection: 'row',
        alignItems: 'center',
    },
    lineOut: {
        width: 330,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    btn: {
        height: 'auto',
        paddingTop: 21,
        paddingBottom: 18,
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    titleText: {
        fontFamily: 'Roboto-Medium',
        fontWeight: '500',
        fontSize: 18,
        color: '#0d0d0d',
        letterSpacing: 0.75,
    },
    posRel: {
        // position: 'relative',
        // display: 'flex',
        flexDirection: 'row',
    },
    subTitle: {
        marginLeft: 30,
        fontSize: 14,
        // top: 2,
        color: '#909090',
        fontFamily: 'Roboto-Medium',
        fontWeight: '500',
        // paddingBottom: 4
    },
    alertText: {
        marginLeft: 30,
        fontSize: 14,
        // top: 2,
        color: '#FF0000',
    },
    successText: {
        marginLeft: 30,
        fontSize: 14,
        // top: 1,
        color: '#259C90',
        // paddingBottom: 5
    },
    successIcon: {
        marginLeft: 2,
        marginTop: -1,
    },
    btnText: {
        fontFamily: 'Roboto-Light',
        fontWeight: '300',
        fontSize: 16,
        color: '#0d0d0d',
        letterSpacing: 0.67,
    },
});

export default Settings;
