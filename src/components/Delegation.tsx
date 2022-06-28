import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {View, Text, Button} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';

import {setMessage} from '../reducers/messages/actions';
import {getBakerDetails} from '../reducers/app/thunks';
import DelegationIllustration from '../../assets/delegation-illustration.svg';
import CustomIcon from '../components/CustomIcon';
import {formatAmount} from '../utils/currency';
import {truncateHash} from '../utils/general';
import {State} from '../reducers/types';

interface DelegationProps {
    onDelegate: () => void;
}

enum DelegationState {
    Clear,
    Delegated,
    Setting,
    Switching,
    //Canceling,
    //PendingClear
}

const Delegation = ({onDelegate}: DelegationProps) => {
    const delegation = useSelector((state: State) => state.app.delegation);
    const pendingDelegations = useSelector((state: State) => state.app.pendingDelegations);
    const balance = useSelector((state: State) => state.app.balance);
    const expectedPaymentDate = useSelector((state: State) => state.app.expectedPaymentDate);
    const hasPendingOperations = useSelector((state: State) => (state.app.pendingDelegations.length > 0 || state.app.pendingTransactions.length > 0));
    const [isPendingModalVisible, setPendingModalVisible] = useState(false);
    const dispatch = useDispatch();

    const lastPendingDelegation = pendingDelegations[0];

    const [delegationState, setDelegationState] = useState(DelegationState.Clear);
    const [bakerName, setBakerName] = useState('');

    useEffect(() => {
        if (delegation.length === 0) { return; }

        setBakerName(truncateHash(delegation));

        (async function anyNameFunction() {
            const bakerDetails = await getBakerDetails(delegation);

            if (bakerDetails.name.length > 0) {
                setBakerName(bakerDetails.name);
            }
          })();
    }, []);

    const togglePendingModal = () => {
        setPendingModalVisible(!isPendingModalVisible);
    };

    const onPress = (value: string) => {
        if (balance === 0) {
            dispatch(setMessage('Delegation requires a non-zero balance', 'info'));
            return;
        }

        if (hasPendingOperations) {
            togglePendingModal();
        } else {
            onDelegate();
        }
    };

    /*

    - not delegating & not pending
        -- grow your stash
    - not delegating & pending
        -- setting delegate to...
    - delegating & not pending
        -- pending rewards in
    - delegating & pending
        -- switching delegate view
    */

    return (
        <View style={styles.container}>
            {/* TODO: need something for not currently delegating, but delegation cancellation is < 5 cycles old */}
            {delegation.length === 0 &&
                (!lastPendingDelegation && (
                    <>
                        <DelegationIllustration />
                        <Text style={[styles.title, styles.typo1]}>
                            Grow your Tezos stash
                        </Text>
                        <Text style={[styles.subtitle, styles.typo2]}>
                            Delegate XTZ to earn returns.
                        </Text>
                        <Button style={styles.btn} onPress={onPress}>
                            <Text style={styles.typo3}>Delegate Now</Text>
                        </Button>

                        <Modal isVisible={isPendingModalVisible}>
                            <View style={styles.warningModal}>
                                <Text style={{marginBottom: 5}}>
                                    There is a pending operation awaiting processing on the chain. It must be included in a block or time out. New operations cannot be submitted until then.
                                </Text>
                                <Button
                                    onPress={togglePendingModal}
                                    style={styles.warningModalButton}>
                                    <Text>OK</Text>
                                </Button>
                            </View>
                        </Modal>
                    </>
                ))}
            {(delegation.length > 0 || lastPendingDelegation) && (
                <>
                    <View style={styles.delegationHeader}>
                        {!lastPendingDelegation && (
                            <View style={styles.currentDelegationHeader}>
                                <View style={styles.dot} />
                                <Text style={styles.typo4}>
                                    Currently Delegating
                                </Text>
                                <Button
                                    transparent
                                    style={styles.edit}
                                    onPress={onDelegate}>
                                    <CustomIcon name="Edit" color="#4b4b4b" />
                                </Button>
                            </View>
                        )}
                        {lastPendingDelegation && (
                            <View style={styles.pending}>
                                <CustomIcon
                                    name="Sand-Timer"
                                    size={16}
                                    color="#f5942a"
                                />
                                <Text style={[styles.pendingText, styles.typo8]}>
                                    Delegation Transaction Pending…
                                </Text>
                            </View>
                        )}
                    </View>
                    {/* <Text style={styles.typo5}>First payout in 35 days</Text> */}
                    <View style={styles.paper}>
                        <View style={styles.delegationPaper}>
                            {lastPendingDelegation && <View style={styles.paperOpacity}/>}
                            <View style={styles.row}>
                                <Text style={styles.typo6}>Amount</Text>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                    }}>
                                    <Text
                                        style={[
                                            styles.paperTextMargin,
                                            styles.typo7,
                                        ]}>
                                        {formatAmount(balance)}
                                    </Text>
                                    <CustomIcon
                                        name="XTZ"
                                        size={16}
                                        color="#343434"
                                        style={{marginTop: 10}}
                                    />
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.row}>
                                <Text style={styles.typo6}>Baker Service</Text>
                                <Text
                                    style={[
                                        styles.paperTextMargin,
                                        styles.typo7,
                                    ]}>
                                    {bakerName}
                                </Text>
                            </View>
                        </View>
                        {!lastPendingDelegation && <View style={styles.delegationDate}>
                            <Text style={styles.typo6}>
                                Next payment expected on{' '}
                                {moment
                                    .utc(new Date(expectedPaymentDate))
                                    .local()
                                    .format('MMM D, HH:mm')}
                            </Text>
                        </View>}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    warningModal: {
        borderRadius: 26,
        height: 155,
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
    },
    container: {
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 25,
    },
    title: {
        marginTop: 25,
    },
    subtitle: {
        marginTop: 10,
    },
    delegationHeader: {
        width: '100%',
    },
    pending: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pendingText: {
        marginLeft: 10,
    },
    currentDelegationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    paper: {
        width: '100%',
    },
    paperOpacity: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 10
    },
    delegationPaper: {
        marginTop: 25,
        borderWidth: 1,
        borderColor: '#eeeded',
        borderRadius: 9,
        width: '100%',
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 1,
        padding: 16,
    },
    paperTextMargin: {
        marginTop: 10,
    },
    delegationDate: {
        marginTop: 10,
        marginLeft: 10,
        alignSelf: 'flex-start',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#e6e4e4',
    },
    row: {
        paddingTop: 12,
        paddingBottom: 20,
        paddingHorizontal: 18,
    },
    dot: {
        width: 11,
        height: 11,
        backgroundColor: '#8ae95a',
        borderRadius: 5.5,
        marginHorizontal: 5,
    },
    btn: {
        marginTop: 22,
        width: 256,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 50
    },
    edit: {
        width: 40,
        height: 40,
        borderColor: '#dbe7fc',
        borderWidth: 1,
        borderRadius: 20,
        position: 'absolute',
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typo1: {
        fontFamily: 'Roboto-Medium',
        fontSize: 24,
        fontWeight: '500',
        color: 'rgb(75, 75, 75)',
    },
    typo2: {
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        fontWeight: '300',
        lineHeight: 21,
    },
    typo3: {
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.85,
        textTransform: 'capitalize',
    },
    typo4: {
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        letterSpacing: 0.75,
    },
    typo5: {
        fontFamily: 'Roboto-Light',
        fontSize: 13,
        fontWeight: '300',
    },
    typo6: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        lineHeight: 18,
        color: 'rgba(0, 0, 0, 0.38)',
    },
    typo7: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 24,
    },
    typo8: {
        fontFamily: 'Roboto-Light',
        fontSize: 14,
        fontWeight: '300',
        color: '#4a4a4a',
    },
});

export default Delegation;
