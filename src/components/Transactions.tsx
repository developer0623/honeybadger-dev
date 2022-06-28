import React from 'react';
import {useSelector} from 'react-redux';
import {Linking, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'; // TODO: update to rn 0.63+ and use Pressable
import {View, Text} from 'native-base';
import moment from 'moment';

import TransactionsIllustration from '../../assets/transactions-illustration.svg';
import {State, Operation} from '../reducers/types';
import CustomIcon from './CustomIcon';
import PendingTransactions from '../components/PendingTransactions';
import {truncateHash} from '../utils/general';
import {formatAmount} from '../utils/currency';
import config from '../config';
import constants from '../utils/constants.json';

const Transactions = () => {
    const transactions = useSelector((state: State) => state.app.transactions);
    const publicHashKey = useSelector(
        (state: State) => state.app.publicKeyHash,
    );

    const onTransactionPress = (opGroupHash: string) => {
        Linking.openURL(`${config[0].explorerUrl}/${opGroupHash}`);
    };

    const displayTransactions = transactions.map((t) => {
        const opGroupHash = t.opGroupHash;
        let iconName = '';
        let action = '';
        let preposition = '';
        let amount = '';
        let amountDirection = 0;
        let address = '';
        const date = moment
            .utc(new Date(t.timestamp))
            .local()
            .format('MMM D, HH:mm');

        if (t.kind === 'transaction') {
            if (t.destination === publicHashKey) {
                iconName = 'Forward-Arrow';
                action = 'Received';
                preposition = 'from';
                address = truncateHash(t.source);
                amount = formatAmount(Number(t.amount));
                amountDirection = 1;
            } else if (t.source === publicHashKey && t.destination.startsWith('KT1')) {
                action = 'Called Contract';
                if (t.entrypoint) {
                    action = 'Called';
                    preposition = `${t.entrypoint} of`;
                } else {
                    preposition = 'at';
                }

                if (Object.keys(constants.knownContractNames).includes(t.destination)) {
                    action = 'Called';
                    address = constants.knownContractNames[t.destination];
                } else {
                    address = truncateHash(t.destination);
                }
                iconName = 'Back-Arrow';
                amount = formatAmount(Number(t.amount));
                amountDirection = Number(t.amount) > 0 ? -1 : 0;
            } else if (t.source === publicHashKey) {
                iconName = 'Back-Arrow';
                action = 'Sent';
                preposition = 'to';
                address = truncateHash(t.destination);
                amount = formatAmount(Number(t.amount));
                amountDirection = -1;
            }
        } else if (t.kind === 'delegation') {
            iconName = t.delegate ? 'Link' : 'Unlink';
            action = t.delegate ? 'Delegated' : 'Delegation Canceled';
            preposition = t.delegate ? 'to' : '';
            address = truncateHash(t.delegate || '');
            amount = '';
            amountDirection = 0;
        }

        return {
            opGroupHash,
            iconName,
            action,
            preposition,
            amountDirection,
            amount,
            address,
            date,
        };
    });

    return (
        <ScrollView>
            <View style={styles.pending}>
                <PendingTransactions />
            </View>
            {displayTransactions.length === 0 && (
                <View style={styles.container}>
                    <TransactionsIllustration />
                    <View style={styles.text}>
                        <Text style={styles.typo1}>
                            You don’t have any transactions yet.{' '}
                        </Text>
                        <Text style={[styles.typo1]}>
                            Fund your account{' '}
                        </Text>
                        <Text style={styles.typo1}>to get started.</Text>
                    </View>
                </View>
            )}
            {displayTransactions.length > 0 &&
                displayTransactions.map((t: any) => (
                    <TouchableOpacity
                        style={styles.list}
                        onPress={() => onTransactionPress(t.opGroupHash)}
                        key={t.opGroupHash}>
                        <View style={styles.listItem}>
                            <View style={styles.left}>
                                <CustomIcon
                                    name={t.iconName}
                                    size={14}
                                    color="#f5942a"
                                />
                            </View>
                            <View style={styles.body}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.typo3}>
                                        {t.action}
                                    </Text>
                                    <Text style={styles.typo4}>
                                        {' '}
                                        {t.preposition}
                                    </Text>
                                </View>
                                {t.preposition.length > 0 && (
                                    <View style={styles.subtitle}>
                                        <Text style={styles.typo3}>
                                            {t.address}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.right}>
                                {t.amountDirection !== 0 && (
                                    <View style={styles.amount}>
                                        <Text
                                            style={[
                                                styles.typo5,
                                                t.amountDirection < 0
                                                    ? styles.colorSend
                                                    : styles.colorReceive,
                                            ]}>
                                            {`${
                                                t.amountDirection < 0
                                                    ? '-'
                                                    : '+'
                                            }${t.amount}`}
                                        </Text>
                                        <CustomIcon
                                            name="XTZ"
                                            size={14}
                                            color={
                                                t.amountDirection < 0
                                                    ? '#e3787d'
                                                    : '#259c90'
                                            }
                                        />
                                    </View>
                                )}
                                <Text style={styles.typo6}>{t.date}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 25,
    },
    text: {
        marginTop: 50,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 50
    },
    list: {
        width: '90%',
        alignSelf: 'center',
    },
    listItem: {
        width: '100%',
        marginTop: 25,
        flexDirection: 'row',
        borderStyle: 'solid',
        alignItems: 'center',
    },
    left: {
        flex: 0,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#f9c000',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 16,
    },
    body: {
        flex: 1,
        marginHorizontal: 7,
        justifyContent: 'center',
    },
    right: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    amount: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subtitle: {
        flexDirection: 'row',
    },
    colorSend: {
        color: '#e3787d',
    },
    colorReceive: {
        color: '#259c90',
    },
    pending: {
        alignItems: 'center',
    },
    typo1: {
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        fontWeight: '300',
        lineHeight: 24,
    },
    typo2: {
        fontWeight: '600',
        color: 'rgb(43, 29, 215)',
    },
    typo3: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        fontWeight: '500',
        color: 'rgb(74, 74, 74)',
    },
    typo4: {
        fontFamily: 'Roboto-Light',
        fontSize: 16,
        fontWeight: '300',
        color: 'rgb(74, 74, 74)',
    },
    typo5: {
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        fontWeight: 'bold',
    },
    typo6: {
        fontFamily: 'Roboto-Medium',
        fontSize: 12,
        fontWeight: '500',
        color: 'rgb(144, 144, 144)',
    },
});

export default Transactions;
