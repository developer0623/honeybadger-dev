import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Linking, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Container, Text, View, Button} from 'native-base';
import Modal from 'react-native-modal';

import {setDelegateAddress} from '../reducers/app/actions';
import {cancelDelegation, getBakerDetails, validateBakerAddress} from '../reducers/app/thunks';
import DelegateFirstIllustration from '../../assets/vault-illustration.svg';
import DelegateSecondIllustration from '../../assets/wallet-illustration.svg';
import EnterAddress from '../components/EnterAddress';
import {colors} from '../theme';
import {truncateHash} from '../utils/general';

import {DelegateAddressProps} from './types';
import {State} from '../reducers/types';
import CustomIcon from '../components/CustomIcon';

const DelegateAddress = ({navigation}: DelegateAddressProps) => {
    const delegation = useSelector((state: State) => state.app.delegation);
    const publicKeyHash = useSelector((state: State) => state.app.publicKeyHash);
    const [isModal, setIsModal] = useState(false);
    const [isUndelegateModal, setIsUndelegateModal] = useState(false);
    const [modalPage, setModalPage] = useState(0);

    const [isValidAddress, setValidAddress] = useState(false);
    const [bakerName, setBakerName] = useState(''); // TODO: use a single structure
    const [bakerAddress, setBakerAddress] = useState('');
    const [bakerFee, setBakerFee] = useState(0);
    const [bakerLogoUrl, setBakerLogoUrl] = useState('');
    const [bakerEstRoi, setBakerEstRoi] = useState(0);

    const dispatch = useDispatch();

    const goNext = () => {
        navigation.navigate('DelegateReview');
    };

    const onValidAddress = async (value: string, valid: boolean) => {
        dispatch(setDelegateAddress(value));
        setValidAddress(valid);
        setBakerAddress(value);

        if (!valid) {
            setBakerName('');
            setBakerFee(0);
            setBakerLogoUrl('');
            setBakerEstRoi(0);

            return;
        }

        const bakerDetails = await getBakerDetails(value);
        setBakerName(bakerDetails.name);
        setBakerFee(bakerDetails.fee);
        setBakerLogoUrl(bakerDetails.logoUrl);
        setBakerEstRoi(bakerDetails.estimatedRoi);
    };

    const goNextModalPage = () => {
        if (modalPage === 1) {
            setIsModal(false);
            setModalPage(0);
        }

        setModalPage(1);
    };
    const onUndelegateConfirmation = () => setIsUndelegateModal(true);
    const onCancelUndelegate = () => setIsUndelegateModal(false);
    const onUndelegate = () => {
        setIsUndelegateModal(false);
        dispatch(cancelDelegation());
        navigation.navigate('Account');
    }
    const modal = [
        {
            title: 'Staked funds remain in your control',
            subtitle: 'Bakers do not have access to delegated balances.',
            btn: 'Next',
        },
        {
            title: 'There is no lock-up period',
            subtitle: 'You are free to transfer funds in and out of your account.',
            btn: 'Got It!',
        },
    ];

    let headerTitle = 'Delegate';
    let addressTitle = 'Enter Baker Address';
    let nextTitle = 'Baker Address';

    if (delegation.length > 0) {
        headerTitle = 'Change Baker Service';
        addressTitle = 'Enter New Baker Address';
        nextTitle = 'Change Baker Address';
    }

    useEffect(() => {
        if (delegation.length > 0) { return; }
        setTimeout(() => { setIsModal(true); }, 500);
    }, []);

    return (
        <Container style={styles.container}>
            <EnterAddress
                headerTitle={headerTitle}
                addressTitle={addressTitle}
                goBack={() => navigation.goBack()}
                validateAddress={(to) => validateBakerAddress(to, publicKeyHash)}
                onValidAddress={onValidAddress}>
                    {isValidAddress && bakerName != undefined && bakerName.length > 0 && (
                        <View>
                        <View style={styles.bakerDetails}>
                            <View style={{flexDirection: 'row'}}>
                                {bakerLogoUrl.length > 0 && (
                                <Image source={{uri: bakerLogoUrl}} style={{width: 50, height: 50, margin: 10, justifyContent: 'center'}} />
                                )}
                                <View style={{justifyContent: 'center', flexGrow: 1}}>
                                    <View style={{alignSelf: 'flex-start'}}>
                                        <Text style={{fontWeight: '700'}}>{bakerName}</Text>
                                        <Text style={{fontWeight: '500', color: 'grey', fontSize: 14}}>{truncateHash(bakerAddress)}</Text>
                                    </View>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <View style={{alignSelf: 'flex-end'}}>
                                        <Text style={{fontWeight: '500', fontSize: 14}}>Fee: {(bakerFee * 100).toFixed(2)}%</Text>
                                    </View>
                                    <View style={{alignSelf: 'flex-end'}}>
                                        <Text style={{fontWeight: '500', fontSize: 14}}>ROI: {(bakerEstRoi * 100).toFixed(2)}%</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Button style={styles.nextButton} onPress={goNext}>
                                    <Text style={styles.typo2}>Next</Text>
                                </Button>
                            </View>
                        </View>
                        <View style={{alignSelf: 'flex-start', width: '90%', marginLeft: 28, marginTop: 10}}>
                            <TouchableOpacity onPress={() => Linking.openURL('https://baking-bad.org/')} style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 12, color: 'grey'}}>Data from </Text><Text style={{textDecorationLine: 'underline', fontSize: 12, color: 'grey'}}>BakingBad</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    )}
                    {(isValidAddress && (bakerName == undefined || bakerName.length === 0)) && (
                        <View style={styles.bakerDetails}>
                            <View>
                                <Button style={styles.nextButton} onPress={goNext}>
                                    <Text style={[styles.typo2, styles.goNext]}>Next</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                    {/*delegation.length > 0 && (
                        <View style={styles.undelegate}>
                            <Text style={styles.undelegateText} onPress={onUndelegateConfirmation}>
                                Undelegate
                            </Text>
                        </View>
                    )*/}
            </EnterAddress>

            <Modal isVisible={isUndelegateModal} style={styles.modal}>
                <View style={styles.undelegateModalContent}>
                    <Text style={styles.typo1}>Terminate Delegation</Text>
                    <View style={styles.undelegateActions}>
                        <Button transparent style={styles.btn} onPress={onCancelUndelegate}>
                            <View>
                                <Text style={[styles.btnEndText, styles.btnNext]}>Cancel</Text>
                            </View>
                        </Button>
                        <Button
                            transparent
                            style={[styles.btn, styles.btnEnd]}
                            onPress={onUndelegate}>
                            <View>
                                <Text style={styles.btnEndText}>Confirm</Text>
                            </View>
                        </Button>
                    </View>
                </View>
            </Modal>

            <Modal
                isVisible={isModal}
                style={styles.modal}
                animationOutTiming={500}
                animationInTiming={500}>
                <View style={styles.modalContent}>
                    <View style={styles.illustration}>
                        {modalPage === 0 && <DelegateFirstIllustration />}
                        {modalPage === 1 && <DelegateSecondIllustration />}
                    </View>
                    <Text style={[styles.title, styles.typo1]}>
                        {modal[modalPage].title}
                    </Text>
                    <Text style={[styles.subtitle, styles.typo2]}>
                        {modal[modalPage].subtitle}
                    </Text>
                    <View style={styles.actions}>
                        <View style={styles.dots}>
                            <View
                                style={
                                    modalPage === 0
                                        ? [styles.dot, styles.activeDot]
                                        : styles.dot
                                }
                            />
                            <View
                                style={
                                    modalPage === 1
                                        ? [styles.dot, styles.activeDot]
                                        : styles.dot
                                }
                            />
                        </View>
                        <View>
                            <Button
                                transparent
                                style={
                                    modalPage === 1
                                        ? [styles.btn, styles.btnEnd]
                                        : styles.btn
                                }
                                onPress={goNextModalPage}>
                                <Text
                                    style={[
                                        styles.btnNext,
                                        styles.typo3,
                                        modalPage === 1
                                            ? styles.btnEndText
                                            : null,
                                    ]}>
                                    {modal[modalPage].btn}
                                </Text>
                                {modalPage === 0 && (
                                    <CustomIcon name="Caret-Left" size={10} />
                                )}
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </Container>
    );
};

const styles = StyleSheet.create({
    bakerDetails: {
        width: '90%',
        marginTop: 24,
        marginHorizontal: 24,
        flexDirection: 'column',
        borderStyle: 'solid',
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 15.5,
        padding: 12,
    },
    nextButton: {
        marginLeft: 'auto',
        width: 128,
        height: 50,
        backgroundColor: '#4b4b4b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    container: {
        backgroundColor: colors.bg,
    },
    modal: {
        margin: 0,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        height: '65%',
        marginTop: 'auto',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        alignItems: 'center',
    },
    illustration: {
        marginTop: 50,
    },
    title: {
        width: 330,
        textAlign: 'center',
        marginTop: 25,
    },
    subtitle: {
        width: 314,
        color: '#1a1919',
    },
    actions: {
        width: '100%',
        marginTop: 'auto',
        marginBottom: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
        alignItems: 'center',
    },
    dots: {
        flexDirection: 'row',
    },
    dot: {
        width: 13,
        height: 13,
        borderRadius: 6.5,
        backgroundColor: '#c1c1c1',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#ff8f00',
    },
    btn: {
        width: 156,
        height: 50,
        borderWidth: 1,
        borderColor: '#979797',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnNext: {
        color: '#0f0c02',
    },
    btnEnd: {
        backgroundColor: '#4b4b4b',
        borderWidth: 0,
    },
    btnEndText: {
        color: '#ffffff',
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.85,
    },
    undelegate: {
        marginTop: 30,
        alignItems: 'center',
    },
    undelegateText: {
        textDecorationLine: 'underline',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
    },
    undelegateModalContent: {
        backgroundColor: '#ffffff',
        height: '35%',
        marginTop: 'auto',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    undelegateActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 75,
        width: '100%',
        paddingHorizontal: 30,
    },
    undelegateCancelText: {
        color: '#4b4b4b'
    },
    goNext: {
        textTransform: 'capitalize',
    },
    typo1: {
        fontFamily: 'Roboto-Medium',
        fontSize: 24,
        fontWeight: '500',
        letterSpacing: 1,
        lineHeight: 34,
    },
    typo2: {
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        fontWeight: '300',
        lineHeight: 30,
    },
    typo3: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        textTransform: 'capitalize',
    },
});

export default DelegateAddress;
