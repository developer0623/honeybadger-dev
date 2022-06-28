import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'native-base';

import CustomIcon from '../components/CustomIcon';

const SecurityLevelButton = () => {
    return (
        <View style={styles.container}>
            <View>
                <CustomIcon name="Goldfish" size={40} color="#f5942a" />
            </View>
            <View style={styles.title}>
                <Text style={styles.typo1}>Your Security Level</Text>
                <Text>Gold Fish</Text>
            </View>
            <View style={styles.oval}>
                <View style={[styles.oval1, styles.center]}>
                    <View style={[styles.oval2, styles.center]}>
                        <View style={styles.oval3} />
                    </View>
                </View>
            </View>
            <View>
                <CustomIcon
                    name="Caret-Left"
                    size={20}
                    color="rgba(0, 0, 0, .3)"
                />
            </View>
        </View>
    );
};

export default SecurityLevelButton;

const styles = StyleSheet.create({
    container: {
        height: 75,
        backgroundColor: '#ffffff',
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    oval: {
        marginLeft: 'auto',
        marginRight: 20,
    },
    oval1: {
        width: 34,
        height: 34,
        backgroundColor: 'rgba(254, 135, 4, .3)',
        borderRadius: 17,
    },
    oval2: {
        width: 24,
        height: 24,
        backgroundColor: 'rgba(254, 135, 4, .6)',
        borderRadius: 12,
    },
    oval3: {
        width: 16,
        height: 16,
        backgroundColor: 'rgba(254, 135, 4, 1)',
        borderRadius: 8,
    },
    title: {
        marginLeft: 12,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    typo1: {
        fontFamily: 'Roboto-Light',
        fontSize: 14,
        fontWeight: '300',
        color: 'rgb(74, 74, 74)',
    },
    typo2: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        fontWeight: '500',
        color: 'rgb(50, 50, 50)',
    },
});
