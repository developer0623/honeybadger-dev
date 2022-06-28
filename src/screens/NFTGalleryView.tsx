import * as React from 'react';
import {Container} from 'native-base';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';

import CustomHeader from '../components/CustomHeader';

import {NavigationProps} from '../screens/types';
import {State} from '../reducers/types';

const btn = {
    size: 30,
    color: '#ffffff',
};

const NFTGalleryView = ({navigation}: NavigationProps) => {
    const {artifactUrl} = useSelector(
        (state: State) => state.nft.selected.details,
    );

    const onBack = () => navigation.goBack();

    return (
        <Container style={s.container}>
            <FastImage style={s.image} source={{uri: artifactUrl}}>
                <CustomHeader
                    onBack={onBack}
                    leftIconName="Cancel"
                    backIconCustomStyles={btn}
                />
            </FastImage>
        </Container>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        position: 'relative',
    },
    image: {
        flex: 1,
    },
});

export default NFTGalleryView;
