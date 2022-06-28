import React from 'react';
import {StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {Text, View} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';

import CustomIcon from '../components/CustomIcon';
import {formatAmount} from '../utils/currency';
import {truncateHash} from '../utils/general';
import config from '../config';
import {State} from '../reducers/types';

const PendingTransactions = () => {
    const dispatch = useDispatch();
    const publicKeyHash = useSelector(
        (state: State) => state.app.publicKeyHash,
    );
    const pendingTransactions = useSelector(
        (state: State) => state.app.pendingTransactions,
    );

    const onPendingTransactionPress = (opGroupHash: string) => {
        if (!opGroupHash) {
            return;
        }
        Linking.openURL(`${config[0].explorerUrl}/${opGroupHash}`);
    };

    const getTitle = (destination: string, amount: number) => {
        if (publicKeyHash === destination) {
            return `Receiving ${formatAmount(amount)}`;
        };
        return `Sending ${formatAmount(amount)}`;
    };

    const getDirection = (destination: string) => {
        if (destination === publicKeyHash) {
            return 'from ';
        };
        return 'to ';
    };

    const getAddress = (destination: string, source: string) => {
        if (destination === publicKeyHash) {
            return truncateHash(source);
        }
        return truncateHash(destination);
    }

    return (
        <>
            {pendingTransactions.length > 0 &&
                pendingTransactions.map((t) => (
                    <TouchableOpacity
                        key={t.operation_group_hash}
                        onPress={() =>
                            onPendingTransactionPress(t.operation_group_hash)
                        }>
                        <View style={styles.container}>
                            <View style={styles.pendingIcon}>
                                <CustomIcon
                                    name="Sand-Timer"
                                    size={16}
                                    color="#f5942a"
                                />
                            </View>
                            <View style={styles.text}>
                                <View style={styles.row}>
                                    <Text style={styles.typo1}>{getTitle(t.destination, t.amount)}</Text>
                                    <CustomIcon
                                        name="XTZ"
                                        size={16}
                                        color="#4a4a4a"
                                    />
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.typo2}>
                                        {getDirection(t.destination)}
                                    </Text>
                                    <Text style={styles.typo1}>{getAddress(t.destination, t.source)}</Text>
                                </View>
                            </View>
                            {/*<View style={styles.linkIcon}>
                                <CustomIcon name="New-Window" size={16} />
                            </View>*/}
                        </View>
                    </TouchableOpacity>
                ))}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 69,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#eeeded',
        borderRadius: 9,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 1,
        padding: 16,
    },
    text: {
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pendingIcon: {
        width: 32,
        height: 32,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#f9c000',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkIcon: {
        marginLeft: 'auto',
    },
    typo1: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        fontWeight: '500',
        color: '#4a4a4a',
    },
    typo2: {
        fontFamily: 'Roboto-Light',
        fontSize: 16,
        fontWeight: '300',
        color: '#4a4a4a',
    },
});

export default PendingTransactions;
