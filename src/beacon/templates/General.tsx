import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {Button} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';

import {State} from '../../reducers/types';
import {BeaconProps} from '../../screens/types';

import CustomIcon from '../../components/CustomIcon';

import {formatAmount, utezToTez, tezToUtez} from '../../utils/currency';

import { beaconSendTransaction, beaconSendDelegation, beaconSendOperations, beaconNotifyCancel } from '../../reducers/beacon/thunks';

import {estimateOperationFee, getBakerDetails} from '../../reducers/app/thunks';

interface BakerDetails {
    name: string;
    address: string;
    fee: number;
    logoUrl: string;
    estimatedRoi: number;
}

const General = ({navigation}: BeaconProps) => {
    const dispatch = useDispatch();
    const {operationDetails, appMetadata} = useSelector((state: State) => state.beacon.beaconMessage);
    const balance = useSelector((state: State) => state.app.balance);
    const secretKey = useSelector((state: State) => state.app.secretKey);

    const [fee, setFee] = useState(utezToTez(0));
    const [baker, setBaker] = useState<null | BakerDetails>(null);
    const [loadingBaker, setLoadingBaker] = useState(false);

    const {name} = appMetadata;
    const {destination, kind, amount, delegate} = operationDetails[0];
    const isContract = String(destination).startsWith('KT1');

    const onAuthorize = () => {
        if (kind === 'transaction') {
            if (isContract) {
                const utezFee = tezToUtez(parseFloat(`${fee}`));
                dispatch(beaconSendOperations(operationDetails, utezFee));
                navigation.navigate('Account');
                return;
            }
            dispatch(beaconSendTransaction(destination, amount, navigation));
            return;
        }

        if (kind === 'delegation') {
            dispatch(beaconSendDelegation(delegate, navigation));
        }
    };

    const onCancel = () => {
        try {
            beaconNotifyCancel();
        } finally {
            navigation.navigate('Account');
        }
    };

    useEffect(() => {
        const fetchBaker = async () => {
            if (delegate) {
                setLoadingBaker(true);
                const bakerDetails = await getBakerDetails(delegate);
                setBaker(bakerDetails);
                setLoadingBaker(false);
            }
        };
        fetchBaker();
    }, [delegate]);

    useEffect(() => {
        const estimateFee = async () => {
            const estimate = await estimateOperationFee(operationDetails, secretKey);
            setFee(utezToTez(estimate));
        };
        estimateFee();
    }, [fee]);

    return (
        <View style={s.container}>
            <View style={s.description}>
                <Text>{`${name} is requesting a ${kind} `}</Text>
                {!delegate && (
                    <>
                        <Text>{'of '}</Text>
                        <Text style={s.bold}>{`${formatAmount(amount)}`}</Text>
                        <CustomIcon name="XTZ" size={12} color="#1a1919" />
                    </>
                )}
                <Text>{'to '}</Text>
                <Text style={s.bold}>{`${delegate || destination}`}</Text>
            </View>
            <Text style={s.section}>Raw Operation Content</Text>
            <TextInput
                style={s.input}
                multiline={true}
                editable={false}
                value={JSON.stringify(operationDetails, null, 2)}
            />
            <View style={[s.row, s.section]}>
                <View style={[s.row, s.available]}>
                    <Text style={[s.availableText, s.typo4]}>Available</Text>
                    <Text style={s.typo4}>{formatAmount(balance)}</Text>
                    <CustomIcon name="XTZ" size={16} color="#343434" />
                </View>
            </View>
            <View style={[s.row, s.end]}>
                    {delegate && (<>
                        <Text style={[s.fee, s.typo5]}>Operation fee ${baker?.fee}</Text>
                        <CustomIcon name="XTZ" size={16} color="#7d7c7c" />
                    </>)}
                    {!delegate && fee > 0 && (<>
                        <Text style={[s.fee, s.typo5]}>Operation fee ${fee}</Text>
                        <CustomIcon name="XTZ" size={16} color="#7d7c7c" />
                    </>)}
                    {fee < 0 && (<Text style={[s.fee, s.typo5]}>Invalid operation</Text>)}
            </View>
            <Text style={s.info}>
                Authorizing will allow this site to carry out this operation for
                you. Always make sure you trust the sites you interact with.
            </Text>
            <View style={[s.row, s.actions]}>
                {(delegate || fee > 0) && (<>
                    <Button style={[s.button, s.cancel]} onPress={onCancel}>
                        <Text>Cancel</Text>
                    </Button>
                    <Button
                        style={s.button}
                        disabled={loadingBaker}
                        onPress={onAuthorize}>
                        <Text style={s.btnText}>Authorize</Text>
                    </Button>
                </>)}
                {(!delegate && fee < 0) && (
                    <Button style={[s.button, s.cancel]} onPress={onCancel}>
                        <Text>Dismiss</Text>
                    </Button>
                )}
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
    },
    description: {
        marginTop: 60,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        marginTop: 20,
        color: 'rgba(0,0,0,0.38)',
        fontSize: 14,
    },
    info: {
        marginTop: 40,
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 10,
        marginTop: 10,
        maxHeight: 200,
    },
    bold: {
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    end: {
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    available: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    availableText: {
        marginRight: 5,
    },
    fee: {
        marginTop: 4,
        textAlign: 'right',
    },
    actions: {
        justifyContent: 'space-between',
        marginTop: 'auto',
        marginBottom: 40,
    },
    button: {
        marginTop: 21,
        width: 160,
        height: 61,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30.5,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
    },
    cancel: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#4b4b4b',
    },
    btnText: {
        textTransform: 'capitalize',
        color: '#ffffff',
    },
    typo4: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#343434',
    },
    typo5: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#7d7c7c',
    },
});

export default General;
