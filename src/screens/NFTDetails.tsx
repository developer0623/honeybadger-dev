import * as React from 'react';
import {StyleSheet, ScrollView, Linking, TouchableOpacity} from 'react-native';
import {Container, View, Text, Button} from 'native-base';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';

import CustomHeader from '../components/CustomHeader';
import CustomIcon from '../components/CustomIcon';

import {NavigationProps} from '../screens/types';
import {State} from '../reducers/types';

import {formatAmount} from '../utils/currency';

import SendIcon from '../../assets/send.svg';

const NFTDetails = ({navigation}: NavigationProps) => {
    const {details, piece, receivedOn, price} = useSelector(
        (state: State) => state.nft.selected,
    );

    const {name, creators, artifactUrl, description, artifactType} = details;
    const isImage =
        artifactType === 'image/gif' ||
        artifactType === 'image/jpeg' ||
        artifactType === 'image/png' ||
        artifactType === 'image/apng';

    const onPressBack = () => {
        navigation.goBack();
    };

    const onPressSend = () => {
        navigation.navigate('NFTSend');
    };

    const onPressLink = () =>
        Linking.openURL(`https://www.hicetnunc.xyz/objkt/${piece}`);

    const onShare = async () => {
        try {
            await Share.open({
                message: `https://www.hicetnunc.xyz/objkt/${piece}`,
                title: 'Share to',
            });
        } catch (e) {
            console.log('[ERROR_SHARE]', e);
        }
    };

    const onPressImage = () => navigation.navigate('NFTGalleryView');

    return (
        <Container>
            <CustomHeader title="NFT Details" onBack={onPressBack} />
            <ScrollView style={s.container} contentContainerStyle={s.grow}>
                <Text style={s.title}>{name}</Text>
                <Text style={s.author}>{`By ${creators}`}</Text>
                <TouchableOpacity onPress={() => isImage && onPressImage()}>
                    {isImage && (
                        <FastImage
                            style={s.image}
                            source={{
                                uri: artifactUrl,
                            }}
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
                </TouchableOpacity>
                <Text style={s.descripton}>{description}</Text>
                <Text style={s.section}>Token</Text>
                <Text style={s.details}>{`OBJKT ${piece}`}</Text>
                <Text style={s.section}>Collected for</Text>
                <View style={s.details}>
                    <Text style={s.detailsText}>{formatAmount(price)}</Text>
                    <CustomIcon name="XTZ" size={16} color="#000000" />
                </View>
                <Text style={s.section}>Collected on</Text>
                <Text style={s.details}>
                    {receivedOn.toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Text>
                <Text style={s.link} onPress={onPressLink}>
                    View on Hic Et Nunc
                </Text>
                <View style={[s.row, s.buttons]}>
                    <Button style={[s.btn, s.grey]} onPress={onPressSend}>
                        <View style={s.icon}>
                            <SendIcon fill="#FFFFFF" />
                        </View>
                        <Text style={s.btnText}>Send NFT</Text>
                    </Button>
                    <Button style={[s.btn, s.white]} onPress={onShare}>
                        <CustomIcon name="Share-Android" />
                        <Text style={[s.share, s.btnText]}>Share</Text>
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
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    grow: {
        flexGrow: 1,
    },
    title: {
        fontWeight: '500',
        fontSize: 16,
        letterSpacing: -0.3,
        marginTop: 25,
    },
    author: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 3,
    },
    image: {
        width: '100%',
        borderRadius: 8,
        height: 228,
        marginTop: 8,
    },
    descripton: {
        fontSize: 16,
        letterSpacing: -0.3,
        marginTop: 16,
    },
    section: {
        fontSize: 12,
        fontWeight: '500',
        color: '#909090',
        marginTop: 18,
    },
    details: {
        marginTop: 5,
        flexDirection: 'row',
    },
    detailsText: {
        fontSize: 16,
        letterSpacing: -0.3,
    },
    link: {
        fontSize: 16,
        letterSpacing: -0.3,
        color: '#2900DB',
        marginTop: 26,
    },
    buttons: {
        marginTop: 54,
        marginBottom: 80,
    },
    btn: {
        borderRadius: 25,
    },
    btnText: {
        fontWeight: '500',
        fontSize: 16,
    },
    grey: {
        backgroundColor: '#4B4B4B',
        width: 190,
        justifyContent: 'center',
    },
    white: {
        backgroundColor: 'rgba(75, 75, 75, 0.1)',
        width: 124,
        justifyContent: 'center',
    },
    share: {
        color: '#000000',
        opacity: 1,
    },
    icon: {
        width: 16,
        height: 16,
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
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default NFTDetails;
