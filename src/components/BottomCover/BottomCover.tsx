import React from 'react';
import {StyleSheet, View} from 'react-native';

interface BottomCoverProps {
    color?: string;
}

const BottomCover = ({color}: BottomCoverProps) => {
    return (
        <View
            style={
                color ? [styles.view, {backgroundColor: color}] : [styles.view]
            }
        />
    );
};

const styles = StyleSheet.create({
    view: {
        width: '100%',
        height: 100,
        backgroundColor: '#ffffff',
        position: 'absolute',
        bottom: 0,
        zIndex: -1,
    },
});

export default BottomCover;
