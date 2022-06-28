import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, Icon} from 'native-base';

interface EnterAddressErrorsProps {
    isVisible: boolean;
    title: string;
    message: string;
}

const EnterAddressErrors = ({isVisible, title, message}: EnterAddressErrorsProps) => {
    return (
        <>
            {isVisible && (
                <View style={styles.container}>
                    <View style={styles.title}>
                        <Icon
                            name="warning"
                            type="AntDesign"
                            style={styles.icon}
                        />
                        <Text style={styles.typo1}>{title}</Text>
                    </View>
                    <View style={styles.text}>
                        <Text style={styles.typo2}>{message}</Text>
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        width: 259,
        backgroundColor: '#f30000',
        alignSelf: 'center',
        borderRadius: 15.5,
        padding: 12,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        color: '#ffffff',
        fontSize: 14,
        marginRight: 8,
    },
    text: {
        marginTop: 3,
        alignSelf: 'center',
    },
    typo1: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0,
        color: '#ffffff',
    },
    typo2: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        fontWeight: 'normal',
        letterSpacing: 0,
        color: '#ffffff',
    },
});

export default EnterAddressErrors;
