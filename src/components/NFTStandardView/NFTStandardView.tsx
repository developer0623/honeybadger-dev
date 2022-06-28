import * as React from 'react';
import {useState} from 'react';
import {View, Text} from 'native-base';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

const NFTStandardView = ({
    item,
    index,
    openLink,
    onSelect,
}: {
    item: any;
    index: number;
    openLink: (id: string) => void;
    onSelect: (item: any) => void;
}) => {
    const {details} = item;
    const {artifactUrl, artifactType, name, creators} = details;
    const isImage =
        artifactType === 'image/gif' ||
        artifactType === 'image/jpeg' ||
        artifactType === 'image/png' ||
        artifactType === 'image/apng';

    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageLoadEnd, setImageLoadEnd] = useState(false);

    const onLoad = () => setImageLoaded(true);

    const onLoadEnd = () => setImageLoadEnd(true);

    return (
        <TouchableOpacity
            style={index === 0 ? [s.item, s.first] : s.item}
            onPress={() => onSelect(item)}>
            <View style={s.imageContainer}>
                {isImage && (
                    <FastImage
                        style={s.image}
                        source={{
                            uri: artifactUrl,
                        }}
                        onLoad={onLoad}
                        onLoadEnd={onLoadEnd}
                    />
                )}
                <View style={s.imageText}>
                    {isImage && !imageLoaded && !imageLoadEnd && (
                        <Text>Loading...</Text>
                    )}
                    {!isImage && (
                        <>
                            <Text style={s.imageUnsupported}>
                                Unsupported artifact type
                            </Text>
                            <Text
                                style={
                                    s.imageUnsupported
                                }>{`(${artifactType})`}</Text>
                            <Text
                                style={[s.imageUnsupported, s.imageLink]}
                                onPress={() =>
                                    !isImage && openLink(item.piece)
                                }>
                                View on hic et nunc
                            </Text>
                        </>
                    )}
                </View>
            </View>
            <View style={s.description}>
                <Text style={s.title}>{name}</Text>
                <Text style={s.address}>{`By ${creators}`}</Text>
            </View>
        </TouchableOpacity>
    );
};

const s = StyleSheet.create({
    item: {
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        marginTop: 16,
        shadowColor: '#000000',
        shadowOffset: {
            width: 1,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 10,
    },
    imageContainer: {
        width: '100%',
        height: 208,
    },
    image: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        position: 'relative',
        justifyContent: 'center',
    },
    imageText: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageUnsupported: {
        marginVertical: 5,
        marginHorizontal: 25,
    },
    imageLink: {
        fontWeight: '700',
        color: '#2900DB',
    },
    description: {
        width: '100%',
        height: 48,
        padding: 8,
    },
    first: {
        marginTop: 24,
    },
    title: {
        fontWeight: '500',
        fontSize: 12,
    },
    address: {
        fontSize: 12,
        color: '#4B4B4B',
    },
});

export default NFTStandardView;
