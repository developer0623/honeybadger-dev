import React, {useState, FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet} from 'react-native';
import {Text, View, Button, HStack} from 'native-base';

import {formatAmount, utezToTez} from '../utils/currency';
import CustomIcon from '../components/CustomIcon';
import {truncateHash} from '../utils/general';
import {State} from '../reducers/types';
import constants from '../utils/constants.json';

interface ReviewProps {
    fromTitle: string;
    from: string;
    toTitle: string;
    to: string;
    fee: number;
    actionTitle: string;
    info?: string;
    onSend: () => void;
}

const Review: FunctionComponent<ReviewProps> = ({
    fromTitle,
    from,
    toTitle,
    to,
    fee,
    actionTitle,
    info = '',
    children,
    onSend,
}) => {
    const isRevealed = useSelector((state: State) => state.app.revealed);
    //const [currency] = useState(0);
    //const [fee] = useState(0.02); // TODO
    //const [feeCurrency] = useState(0.001423); // TODO

    // TODO: if TezosNodeReader.isImplicitAndEmpty show a note on burn

    return (
        <View style={styles.paper}>
            <Text style={[styles.title, styles.typo1]}>{fromTitle}</Text>
            <HStack justifyContent="center" alignItems="center">
                <Text fontSize="2xl">{truncateHash(from)}</Text>
            </HStack>
            <View style={styles.dividerLine} />
            {children}
            {/*<View style={styles.currency}>
                    <Text style={styles.typo4}>$</Text>
                    <Text style={styles.typo4}>{currency}</Text>
                </View>*/}
            <View style={styles.dividerLine} />
            <View style={[styles.dividerArrow1, styles.arrow]} />
            <View style={[styles.dividerArrow2, styles.arrow]} />
            <Text style={[styles.title, styles.typo1, styles.recipient]}>
                {toTitle}
            </Text>
            <HStack justifyContent="center" alignItems="center">
                <Text fontSize="2xl">{truncateHash(to)}</Text>
            </HStack>
            {info.length > 0 && (
                <HStack justifyContent="center" alignItems="center">
                    <Text fontSize="xl">{info}</Text>
                </HStack>
            )}
            <View style={[styles.fee, styles.row]}>
                <HStack justifyContent="center" alignItems="center">
                    <Text fontSize="lg">
                        {`Operation Fee ${isRevealed ? formatAmount(fee) : (utezToTez(fee) + utezToTez(constants.fees.reveal)).toFixed(3)}`}    
                    </Text>
                    <CustomIcon name="XTZ" size={14} />
                </HStack>
            </View>
            <Button style={styles.button} onPress={onSend}>
                <Text style={styles.btnText}>{actionTitle}</Text>
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    paper: {
        backgroundColor: '#ffffff',
        flexGrow: 1,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        marginTop: 20,
        paddingHorizontal: 36,
        paddingTop: 67,
        paddingBottom: 100,
        alignItems: 'center',
    },
    title: {
        color: '#343434',
    },
    address: {
        marginTop: 13,
    },
    dividerLine: {
        marginTop: 20,
        marginBottom: 26,
        width: 2,
        height: 56,
        backgroundColor: '#fcd104',
        zIndex: 10,
    },
    dividerArrow1: {
        marginTop: -30,
        borderTopColor: '#fcd104',
    },
    dividerArrow2: {
        marginTop: -9,
        borderTopColor: '#ffffff',
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightWidth: 6,
        borderRightColor: 'transparent',
        borderTopWidth: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    children: {
        marginTop: 15,
    },
    currency: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipient: {
        marginTop: 23,
    },
    fee: {
        marginTop: 5,
    },
    feeCurrency: {
        marginLeft: 2,
    },
    button: {
        marginTop: 21,
        width: 277,
        height: 61,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30.5,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
    },
    info: {
        marginVertical: 20,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#979797',
    },
    infoText: {
        textAlign: 'center',
    },
    btnText: {
        textTransform: 'capitalize',
        color: 'white'
    },
    typo1: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        fontWeight: 'normal',
    },
    typo2: {
        fontFamily: 'Roboto-Medium',
        fontSize: 24,
        fontWeight: '500',
    },
    typo3: {
        fontFamily: 'Roboto-Medium',
        fontSize: 36,
        fontWeight: '500',
        color: '#1a1919',
    },
    typo4: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        fontWeight: '500',
        color: '#7f7c7c',
    },
    typo5: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7f7c7c',
    },
});

export default Review;
