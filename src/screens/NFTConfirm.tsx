import * as React from 'react';
import {Container, View, Text, Button} from 'native-base';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';

import CustomHeader from '../components/CustomHeader';

import {NavigationProps} from '../screens/types';
import {State} from '../reducers/types';

import {truncateHash} from '../utils/general';

import EditIcon from '../../assets/edit.svg';

import {transferThunk} from '../reducers/nft/thunks';

const NFTConfirm = ({navigation}: NavigationProps) => {
    const dispatch = useDispatch();
    const {details, piece} = useSelector((state: State) => state.nft.selected);
    const publicKeyHash = useSelector(
        (state: State) => state.app.publicKeyHash,
    );
    const {sendAddress, sendQty} = useSelector((state: State) => state.nft);

    const {name, creators, artifactUrl, artifactType} = details;

    const isImage =
        artifactType === 'image/gif' ||
        artifactType === 'image/jpeg' ||
        artifactType === 'image/png' ||
        artifactType === 'image/apng';

    const onClose = () => navigation.navigate('Account');

    const onEdit = () => navigation.goBack();

    const onConfirm = () => {
        dispatch(transferThunk(sendAddress, sendQty, piece));
        navigation.navigate('Account');
    };

    const onPressImage = () => navigation.navigate('NFTGalleryView');

    return (
        <Container>
            <CustomHeader title="Confirm Transaction" onClose={onClose} />
            <ScrollView style={s.container} contentContainerStyle={s.grow}>
                <Text style={s.info}>
                    Please review your transaction and ensure that the details
                    are correct.
                </Text>
                <Text style={s.label}>{`SEND OBJKT #${piece}`}</Text>
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
                <Text style={[s.section, s.first]}>From</Text>
                <Text style={[s.info, s.details]}>
                    {truncateHash(publicKeyHash)}
                </Text>
                <Text style={[s.section, s.first]}>To</Text>
                <Text style={[s.info, s.details]}>
                    {truncateHash(sendAddress)}
                </Text>
                <Text style={[s.section, s.first]}>Quantity</Text>
                <Text style={[s.info, s.details]}>{`${sendQty} X`}</Text>
                <View style={s.feeWrapper}>
                    <Text style={s.fee}>Transaction Fee</Text>
                    <Text style={s.feeValue}>0.059 XTZ ($0.02)</Text>
                </View>
                <View style={s.buttons}>
                    <Button style={[s.btn, s.edit]} onPress={onEdit}>
                        <Text style={s.editText}>Edit</Text>
                        <EditIcon fill="rgba(0, 0, 0, .6)" />
                    </Button>
                    <Button style={[s.btn, s.confirm]} onPress={onConfirm}>
                        <Text>Confirm</Text>
                    </Button>
                </View>
            </ScrollView>
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
    info: {
        fontSize: 16,
        letterSpacing: -0.3,
    },
    label: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 16,
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
        marginTop: 8,
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
    section: {
        fontSize: 12,
        fontWeight: '500',
        color: '#909090',
        marginTop: 8,
    },
    details: {
        marginTop: 4,
    },
    first: {
        marginTop: 8,
    },
    feeWrapper: {
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 8,
        height: 72,
        marginTop: 20,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 13,
    },
    fee: {
        fontSize: 12,
        fontWeight: '500',
        color: '#909090',
    },
    feeValue: {
        marginTop: 6,
        fontSize: 16,
        letterSpacing: -0.3,
    },
    buttons: {
        marginTop: 26,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn: {
        width: 164,
        height: 39,
        borderRadius: 20,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    edit: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#909090',
    },
    confirm: {
        backgroundColor: '#4B4B4B',
        fontWeight: '500',
    },
    editText: {
        color: 'rgba(0, 0, 0, .6)',
        fontWeight: '500',
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

export default NFTConfirm;
