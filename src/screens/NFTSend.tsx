import * as React from 'react';
import {useState} from 'react';
import {Container, View, Text, Button} from 'native-base';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector, useDispatch} from 'react-redux';

import CustomHeader from '../components/CustomHeader';
import EnterAddressCamera from '../components/EnterAddress/EnterAddressCamera';

import {NavigationProps} from '../screens/types';
import {State} from '../reducers/types';

import ScanIcon from '../../assets/scan.svg';
import SubtractIcon from '../../assets/subtract.svg';
import AddIcon from '../../assets/add.svg';

import {validateBakerAddress} from '../reducers/app/thunks';

import {setNFTSendDetails} from '../reducers/nft/actions';

const NFTSend = ({navigation}: NavigationProps) => {
    const dispatch = useDispatch();
    const {details, amount} = useSelector((state: State) => state.nft.selected);
    const publicKeyHash = useSelector(
        (state: State) => state.app.publicKeyHash,
    );

    const [address, setAddress] = useState('');
    const [qty, setQty] = useState(1);
    const [errorAddress, setErrorAddress] = useState('');
    const [showCamera, setShowCamera] = useState(false);

    const {name, creators, artifactUrl, artifactType} = details;

    const isImage =
        artifactType === 'image/gif' ||
        artifactType === 'image/jpeg' ||
        artifactType === 'image/png' ||
        artifactType === 'image/apng';

    const onChangeAddress = (text: string) => {
        setAddress(text);
        setErrorAddress('');
    };

    const onChangeQty = (value: number) => {
        if (value < 1 || value > amount) {
            return;
        }
        setQty(value);
    };

    const onPressNext = async () => {
        try {
            await validateBakerAddress(address, publicKeyHash);
            setErrorAddress('');
            dispatch(setNFTSendDetails(qty, address));
            navigation.navigate('NFTConfirm');
        } catch (error) {
            setErrorAddress(error.message);
        }
    };

    const onBarcodeRecognized = ({data}: {data: string}) => {
        if (data && data.length) {
            onChangeAddress(data);
            setShowCamera(false);
        }
    };

    const onShowCamera = () => setShowCamera(true);

    const onPressImage = () => navigation.navigate('NFTGalleryView');

    return (
        <Container>
            <EnterAddressCamera
                open={showCamera}
                onBarcodeRecognized={onBarcodeRecognized}
                onBack={() => setShowCamera(false)}
            />
            {!showCamera && (
                <>
                    <CustomHeader
                        title="Send NFT"
                        onBack={() => navigation.goBack()}
                    />
                    <ScrollView
                        style={s.container}
                        contentContainerStyle={s.grow}>
                        <Text>To</Text>
                        <View style={s.inputWrapper}>
                            <TextInput
                                style={s.input}
                                value={address}
                                autoCorrect={false}
                                autoCapitalize="none"
                                placeholder="Recipient Address (e.g tz1…)"
                                onChangeText={onChangeAddress}
                            />
                            <View style={s.scan}>
                                <TouchableOpacity
                                    style={s.scanInner}
                                    onPress={onShowCamera}>
                                    <ScanIcon />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={s.error}>{errorAddress}</Text>
                        <TouchableOpacity
                            style={s.paper}
                            onPress={() => isImage && onPressImage()}>
                            {isImage && (
                                <FastImage
                                    style={s.image}
                                    source={{uri: artifactUrl}}
                                />
                            )}
                            {!isImage && (
                                <View style={[s.image, s.unsuported]}>
                                    <Text style={s.imageUnsupported}>
                                        Unsupported artifact type
                                    </Text>
                                    <Text
                                        style={
                                            s.imageUnsupported
                                        }>{`(${artifactType})`}</Text>
                                </View>
                            )}
                            <Text style={s.title}>{name}</Text>
                            <Text style={s.address}>{`By ${creators}`}</Text>
                        </TouchableOpacity>
                        <Text style={s.quantity}>Quantity</Text>
                        <View style={s.row}>
                            <Button
                                style={s.btn}
                                onPress={() => onChangeQty(qty - 1)}>
                                <SubtractIcon />
                            </Button>
                            <Text style={s.qty}>{qty}</Text>
                            <Button
                                style={s.btn}
                                onPress={() => onChangeQty(qty + 1)}>
                                <AddIcon />
                            </Button>
                            <Text style={s.amount}>{`of ${amount}`}</Text>
                        </View>
                        <Button
                            style={s.next}
                            onPress={onPressNext}
                            disabled={!!errorAddress}>
                            <Text>Next</Text>
                        </Button>
                    </ScrollView>
                </>
            )}
        </Container>
    );
};

const s = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
    },
    grow: {
        flexGrow: 1,
    },
    label: {
        fontSize: 16,
        letterSpacing: -0.3,
        color: '#4B4B4B',
    },
    input: {
        borderWidth: 1,
        borderColor: '#2900DB',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        height: 56,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    inputWrapper: {
        position: 'relative',
        marginTop: 8,
    },
    scan: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 60,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanInner: {
        width: '90%',
        height: '80%',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        width: '100%',
        height: 245,
        marginTop: 32,
        padding: 16,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 8,
    },
    title: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 6,
    },
    address: {
        fontSize: 12,
        color: '#4B4B4B',
    },
    quantity: {
        fontSize: 16,
        marginTop: 32,
    },
    btn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9C000',
    },
    row: {
        marginTop: 13,
        flexDirection: 'row',
        alignItems: 'center',
    },
    qty: {
        marginHorizontal: 8,
    },
    amount: {
        marginLeft: 16,
    },
    error: {
        marginTop: 6,
        color: 'red',
    },
    next: {
        marginTop: 100,
        width: 256,
        height: 48,
        backgroundColor: '#4B4B4B',
        borderRadius: 25,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    imageUnsupported: {
        marginVertical: 5,
        marginHorizontal: 25,
    },
    imageLink: {
        fontWeight: '700',
        color: '#2900DB',
    },
    unsuported: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default NFTSend;
