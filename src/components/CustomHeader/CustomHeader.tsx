import React from 'react';
import {StyleSheet} from 'react-native';
import { HStack, Button, Text} from 'native-base';

import CustomIcon from '../CustomIcon';

import {CustomHeaderProps} from './types';

const CustomHeader = ({
    title,
    onBack,
    onClose,
    RightComponent,
    leftIconName = 'Back-Arrow',
    rightIconName = 'Cancel',
    backIconCustomStyles,
    closeIconCustomStyles,
}: CustomHeaderProps) => {
    const defaultIconStyles = {
        size: 16,
        color: '#000000',
    };
    const closeIconStyles = {
        ...defaultIconStyles,
        ...closeIconCustomStyles,
    };
    const backIconStyles = {
        ...defaultIconStyles,
        ...backIconCustomStyles,
    };
    return (
        <>
            <HStack px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
                <HStack alignItems="center" style={styles.button}>
                    {onBack && (
                        <Button variant="unstyled" onPress={onBack}>
                            <CustomIcon
                                name={leftIconName}
                                size={backIconStyles.size}
                                color={backIconStyles.color}
                            />
                        </Button>
                    )}
                </HStack>
                <HStack>{title && <Text style={styles.title}>{title}</Text>}</HStack>
                <HStack style={styles.button}>
                    {onClose && !RightComponent && (
                        <Button variant="unstyled" onPress={onClose}>
                            <CustomIcon
                                name={rightIconName}
                                size={closeIconStyles.size}
                                color={closeIconStyles.color}
                            />
                        </Button>
                    )}
                    {RightComponent && !onClose && RightComponent}
                </HStack>
            </HStack>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        flexGrow: 0,
        minWidth: 50,
        maxWidth: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        fontWeight: '500',
        lineHeight: 24,
        letterSpacing: 0.83,
        color: '#000000',
        alignSelf: 'center',
    },
});

export default CustomHeader;
