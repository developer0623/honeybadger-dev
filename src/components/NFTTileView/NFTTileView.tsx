import * as React from 'react';
import {useState} from 'react';
import {View, Text} from 'native-base';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

const NFTTileView = ({
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
    const {artifactUrl, artifactType, name} = details;
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
            style={index === 0 || index === 1 ? [s.item, s.first] : s.item}
            onPress={() => onSelect(item)}>
            <View
                style={
                    !isImage ? [s.imageContainer, s.border] : s.imageContainer
                }>
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
                            <Text style={s.title}>{name}</Text>
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
        </TouchableOpacity>
    );
};

const s = StyleSheet.create({
    item: {
        width: '50%',
        height: 200,
        padding: 6,
    },
    inner: {
        borderWidth: 1,
        width: '100%',
        height: '100%',
    },
    first: {
        marginTop: 24,
    },
    title: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 10,
        textAlign: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'relative',
        justifyContent: 'center',
    },
    imageText: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
    },
    imageUnsupported: {
        marginVertical: 5,
        marginHorizontal: 25,
        fontSize: 10,
        textAlign: 'center',
    },
    imageLink: {
        fontWeight: '700',
        fontSize: 10,
        color: '#2900DB',
    },
    border: {
        borderWidth: 1,
        borderColor: 'rgba(75, 75, 75, 0.1)',
    },
});

export default NFTTileView;
