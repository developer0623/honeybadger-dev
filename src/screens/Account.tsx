/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { Box, Button, Text, View } from 'native-base';
import * as Keychain from 'react-native-keychain';
import Modal from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import BeaconMessages from '../beacon/BeaconMessages';

import { syncAccount } from '../reducers/app/thunks';
import { setMessage } from '../reducers/messages/actions';
import Transactions from '../components/Transactions';
import Delegation from '../components/Delegation';
import Receive from '../../assets/receive.svg';
import Send from '../../assets/send.svg';

import CustomIcon from '../components/CustomIcon';
import { truncateHash } from '../utils/general';
import { formatAmount } from '../utils/currency';

import { State } from '../reducers/types';
import { AccountProps } from './types';
import Fish from '../../assets/fish.svg';
import Circle from '../../assets/circle.svg';
import RightArrow from '../../assets/right-arrow.svg';
import Salmon from '../../assets/salmon.svg';
import BgGradient from '../../assets/bg-gradient.svg';
import NFTIcon from '../../assets/nft.svg';
import XTZIcon from '../../assets/xtz.svg';

const Account = ({ navigation }: AccountProps) => {
    const dispatch = useDispatch();
    const publicKeyHash = useSelector(
        (state: State) => state.app.publicKeyHash,
    );
    const balance = useSelector((state: State) => state.app.balance);
    const [tab, setTab] = useState(0);
    const [openSettings, setOpenSettings] = useState(false);

    const [modalNext, setModalNext] = useState('');
    const hasPendingOperations = useSelector(
        (state: State) =>
            state.app.pendingDelegations.length > 0 ||
            state.app.pendingTransactions.length > 0,
    );
    const [isPendingModalVisible, setPendingModalVisible] = useState(false);
    const [refreshTimer, setRefreshTimer] = useState(undefined as any);
    const [securityLevel, setSecurityLevel] = useState('3');
    const changeTab = (newTab: number) => {
        if (newTab === tab) {
            return;
        }
        setTab(newTab);
    };

    useEffect(() => {
        async function load() {
            try {
                const wallet = await Keychain.getGenericPassword();
                let data: any = await Keychain.getInternetCredentials(
                    'securitySetup',
                );
                if (data) {
                    data = JSON.parse(data.password);
                    console.log("account data=>", data)
                    if (data.securitySetup && data.phraseBackedUp) {
                        setSecurityLevel('2');
                    } else if (data.securitySetup || data.phraseBackedUp) {
                        setSecurityLevel('1');
                    } else {
                        setSecurityLevel('0');
                    }
                } else {
                    setSecurityLevel('0');
                }

                if (wallet) {
                    dispatch(syncAccount());
                    if (!refreshTimer) {
                        setRefreshTimer(
                            setInterval(() => {
                                dispatch(syncAccount());
                            }, 60000),
                        );
                    }
                } else {
                    navigation.replace('Welcome');
                }
            } catch (error) {
                console.log("Keychain couldn't be accessed!", error);
            }
        }
        load();
        navigation.addListener('didFocus', async (payload: any) => {
            try {
                let data: any = await Keychain.getInternetCredentials(
                    'securitySetup',
                );
                if (data) {
                    data = JSON.parse(data.password);
                    if (data.securitySetup && data.phraseBackedUp) {
                        setSecurityLevel('2');
                    } else if (data.securitySetup || data.phraseBackedUp) {
                        setSecurityLevel('1');
                    } else {
                        setSecurityLevel('0');
                    }
                } else {
                    setSecurityLevel('0');
                }
            } catch (error) {
                // error
            }
        });
    }, [navigation]);

    const onPress = (value: string) => {
        if (balance === 0 && value === 'SendAddress') {
            dispatch(setMessage('Balance too low', 'info'));
            return;
        }

        if (value === 'SendAddress' && hasPendingOperations) {
            togglePendingModal();
        } else if (value === 'SendAddress' || value === 'Receive') {
            setModalNext(value);
            toggleModal(value);
        } else {
            navigation.navigate(value);
        }
    };

    const onDelegate = () => navigation.navigate('DelegateAddress');

    const onMenuSelect = (item: any) => {
        setOpenSettings(false);
        navigation.navigate(item.screen);
    };

    const toggleModal = (value: string) => {
        if (value) {
            navigation.navigate(value);
        }
    };

    const togglePendingModal = () => {
        setPendingModalVisible(!isPendingModalVisible);
    };

    const beaconItems = [
        { title: 'Connect dApp', screen: 'BeaconInfo', action: onMenuSelect }
    ];

    const commonItems = [
        { title: 'Settings', screen: 'Settings', action: onMenuSelect }
    ];

    const menuItems =
        Platform.OS === 'ios' ? [...beaconItems, ...commonItems] : commonItems;

    const navigateToSecurity = () => {
        navigation.navigate('SecurityLevel');
    };

    return (
        <Box style={styles.container}>
            <BgGradient style={styles.bg} />
            {Platform.OS === 'ios' && (
                <BeaconMessages navigation={navigation} route={undefined} />
            )}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View>
                    <View style={styles.account}>
                        {/*<Text style={styles.typo1}>{`My account (${truncateHash(
                            publicKeyHash,
                        )})`}</Text>*/}
                        <Menu
                            opened={openSettings}
                            onBackdropPress={() => setOpenSettings(false)}
                            style={styles.menu}>
                            <MenuTrigger
                                customStyles={{
                                    TriggerTouchableComponent: () => (
                                        <Button
                                            style={styles.menuBtn}
                                            variant="unstyled"
                                            onPress={() =>
                                                setOpenSettings(true)
                                            }>
                                            <View style={styles.icon}>
                                                <View style={styles.dot} />
                                                <View style={styles.dot} />
                                                <View style={styles.dot} />
                                            </View>
                                        </Button>
                                    ),
                                }}
                            />
                            <MenuOptions
                                optionsContainerStyle={styles.menuOptions}>
                                {menuItems.map((item, index) => (
                                    <MenuOption
                                        onSelect={() => item.action(item)}
                                        value={item.title}
                                        text={item.title}
                                        key={item.title}
                                        customStyles={{
                                            optionWrapper:
                                                index === menuItems.length - 1
                                                    ? styles.menuOption
                                                    : [
                                                        styles.menuOption,
                                                        styles.menuLastItem,
                                                    ],
                                            optionText: styles.typo5,
                                        }}
                                    />
                                ))}
                            </MenuOptions>
                        </Menu>
                    </View>
                    <View style={styles.amount}>
                        <View style={[styles.center, styles.row]}>
                            <Text fontSize="3xl" style={styles.typo2}>
                                {formatAmount(balance)}
                            </Text>
                            {/* <CustomIcon name="XTZ" size={30} color="#1a1919" /> */}
                            <View style={styles.xtzIcon}>
                                <XTZIcon />
                            </View>
                        </View>
                        {/*<View style={styles.center}>
                            <Text style={styles.typo3}>$0.00</Text>
                        </View>*/}
                    </View>
                    <View style={styles.actions}>
                        <View style={styles.center}>
                            <Button
                                variant="unstyled"
                                size="sm"
                                style={styles.actionBtn}
                                onPress={() => onPress('Receive')}>
                                <View style={styles.actionCircle}>
                                    <Receive />
                                </View>
                            </Button>
                            <Text style={[styles.actionLabel, styles.typo4]}>
                                Receive
                            </Text>
                        </View>
                        <View style={styles.center}>
                            <Button
                                variant="unstyled"
                                size="sm"
                                style={styles.actionBtn}
                                onPress={() => onPress('SendAddress')}>
                                <View style={styles.actionCircle}>
                                    <Send fill="#000000" />
                                </View>
                            </Button>
                            <Text style={[styles.actionLabel, styles.typo4]}>
                                Send
                            </Text>
                        </View>
                        <View style={styles.center}>
                            <Button
                                variant="unstyled"
                                size="sm"
                                style={styles.actionBtn}
                                onPress={() => onPress('NFTGallery')}>
                                <View style={styles.actionCircle}>
                                    <NFTIcon fill="#000000" />
                                </View>
                            </Button>
                            <Text style={[styles.actionLabel, styles.typo4]}>
                                NFTs
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottom}>
                    {/*((transactions.length > 0 && tab === 0) ||
                        (delegations.length > 0 && tab === 1)) && (
                        <View style={styles.securityBtn}>
                            <SecurityLevelButton />
                        </View>
                    )*/}
                    {securityLevel === '0' && (
                        <TouchableOpacity
                            style={styles.security}
                            onPress={() => navigateToSecurity()}>
                            <View>
                                {/* <Image style={{width:47,height:35,marginRight:16}} source={require('../../assets/fish.png')} /> */}
                                <Fish
                                    style={{
                                        width: 47,
                                        height: 35,
                                        marginRight: 16,
                                    }}
                                />
                            </View>
                            <View style={{ width: '75%' }}>
                                <Text style={styles.typo6}>
                                    Your Security Level
                                </Text>
                                <Text style={styles.typo3}>
                                    Level 1: Goldfish
                                </Text>
                            </View>
                            {/* <View>
                                <Circle style={{width:60,height:59,marginRight:16}}/>
                            </View> */}
                            <View>
                                <RightArrow style={{ width: 9, height: 14 }} />
                            </View>
                        </TouchableOpacity>
                    )}
                    {securityLevel === '1' && (
                        <TouchableOpacity
                            style={styles.security}
                            onPress={() => navigateToSecurity()}>
                            <View>
                                <Salmon
                                    style={{
                                        width: 47,
                                        height: 35,
                                        marginRight: 16,
                                    }}
                                />
                            </View>
                            <View style={{ width: '75%' }}>
                                <Text style={styles.typo6}>
                                    Your Security Level
                                </Text>
                                <Text style={styles.typo3}>
                                    Level 2: Savvy Salmon
                                </Text>
                            </View>
                            {/* <View>
                            <Circle style={{width:60,height:59,marginRight:16}}/>
                            </View> */}
                            <View>
                                <RightArrow style={{ width: 9, height: 14 }} />
                            </View>
                        </TouchableOpacity>
                    )}
                    {/* {
                        securityLevel === "2" &&
                        <TouchableOpacity style={styles.security} onPress={() => navigateToSecurity()}>
                            <View>
                                <Image style={{width:47,height:35,marginRight:16}} source={require('../../assets/dolphin.png')} />
                            </View>
                            <View style={{width:'57%'}}>
                                <Text style={styles.typo6}>Your Security Level</Text>
                                <Text style={styles.typo3}>Level 3: Discreet Dolphin</Text>
                            </View>
                            <View>
                                <Image style={{width:60,height:59,marginRight:16}} source={require('../../assets/circle.png')} />
                            </View>
                            <View>
                                <Image style={{width:9,height:14}} source={require('../../assets/right-arrow.png')} />
                            </View>
                        </TouchableOpacity>
                    } */}

                    <View style={styles.tabs}>
                        <View
                            style={[
                                styles.tab,
                                tab === 0
                                    ? styles.tabBorderActive
                                    : styles.tabBorderInactive,
                            ]}>
                            <Button
                                style={styles.tabBtn}
                                variant="unstyled"
                                onPress={() => changeTab(0)}>
                                <Text
                                    style={[
                                        styles.typo3,
                                        tab === 0
                                            ? styles.tabActive
                                            : styles.tabInactive,
                                    ]}>
                                    Transactions
                                </Text>
                            </Button>
                        </View>
                        <View
                            style={[
                                styles.tab,
                                tab === 1
                                    ? styles.tabBorderActive
                                    : styles.tabBorderInactive,
                            ]}>
                            <Button
                                style={styles.tabBtn}
                                variant="unstyled"
                                onPress={() => changeTab(1)}>
                                <Text
                                    style={[
                                        styles.typo3,
                                        tab === 1
                                            ? styles.tabActive
                                            : styles.tabInactive,
                                    ]}>
                                    Delegation
                                </Text>
                            </Button>
                        </View>
                    </View>
                    <View style={styles.tabContainer}>
                        {tab === 0 && <Transactions />}
                        {tab === 1 && <Delegation onDelegate={onDelegate} />}
                    </View>
                </View>

                <Modal isVisible={isPendingModalVisible}>
                    <View style={styles.warningModal}>
                        <Text style={{ marginBottom: 5 }}>
                            There is a pending operation awaiting processing on
                            the chain. It must be included in a block or time
                            out. New operations cannot be submitted until then.
                        </Text>
                        <Button
                            onPress={togglePendingModal}
                            style={styles.warningModalButton}>
                            <Text>OK</Text>
                        </Button>
                    </View>
                </Modal>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    warningModal: {
        borderRadius: 26,
        padding: 15,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    warningModalButton: {
        width: 160,
        height: 50,
        borderColor: '#4b4b4b',
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
        marginTop: 10,
    },
    container: {
        position: 'relative',
    },
    bg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    bottom: {
        marginTop: 25,
        backgroundColor: '#ffffff',
        flex: 1,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        alignItems: 'center',
    },
    menu: {
        marginRight: 25,
    },
    menuOptions: {
        width: 200,
        borderRadius: 11,
        padding: 15,
        right: 20,
        position: 'absolute',
    },
    menuOption: {
        paddingVertical: 20,
    },
    menuLastItem: {
        borderBottomColor: '#e6e4e4',
        borderBottomWidth: 1,
    },
    menuBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
        width: 50,
        height: 50,
    },
    actionBtn: {
        width: 50,
        height: 50,
    },
    xtzIcon: {
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 5,
        backgroundColor: '#000000',
        margin: 2,
    },
    account: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 24,
        justifyContent: 'flex-end',
        position: 'relative',
        marginTop: 44,
    },
    amount: {
        marginTop: 20,
    },
    actions: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 30
    },
    actionCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 64,
        height: 64,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 64,
        margin: 20,
        padding: 20,
    },
    actionLabel: {
        marginTop: 30,
    },
    tabs: {
        marginTop: 5,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tab: {
        borderBottomWidth: 3,
        borderRadius: 0,
        width: '50%',
        justifyContent: 'center',
    },
    tabBtn: {
        alignSelf: 'center',
    },
    tabContainer: {
        width: '100%',
    },
    tabActive: {
        color: 'rgba(0, 0, 0, 0.92)',
    },
    tabInactive: {
        color: 'rgb(125, 124, 124)',
    },
    tabBorderActive: {
        borderBottomColor: '#f1c20e',
    },
    tabBorderInactive: {
        borderBottomColor: '#e8e8e8',
    },
    securityBtn: {
        marginVertical: 20,
        width: '90%',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    typo1: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
        color: 'rgb(75, 75, 75)',
    },
    typo2: {
        fontFamily: 'Roboto-Medium',
        // fontSize: 36,
        fontWeight: '500',
        color: 'rgb(26, 25, 25)',
    },
    typo3: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 27,
        textTransform: 'capitalize',
    },
    typo4: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        fontWeight: 'normal',
    },
    typo5: {
        fontFamily: 'Roboto-Light',
        fontWeight: '300',
        fontSize: 16,
        letterSpacing: 0.67,
    },
    typo6: {
        fontFamily: 'Roboto-Light',
        fontWeight: '300',
        fontSize: 14,
    },
    security: {
        borderRadius: 9,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 16,
        margin: 20,
        backgroundColor: '#fff',
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inlineElements: {},
});

export default Account;
