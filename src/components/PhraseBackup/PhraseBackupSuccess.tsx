import React from 'react';
import { Box, Container, Text, View, Button } from 'native-base';
import { StyleSheet } from 'react-native';

import Checkmark from '../../../assets/checkmark.svg';

const PhraseBackupSuccess = (props: any) => {

    return (
        <Box>
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <View style={styles.icon}>
                        <Checkmark />
                    </View>
                    <Text style={styles.title}>Recovery Phrase Backed up</Text>
                    <Text style={styles.paragraph}>
                        Please keep your recovery phrase safe. We recommend that you store it in at least two places in case of fire, flood, or any other chances that it gets destroyed.
                    </Text>
                </View>
                <Button style={styles.btn} onPress={() => props.navigation.navigate('Account')}>
                    <Text style={styles.typo3}>Back to wallet</Text>
                </Button>
                {/* <Text style={{marginBottom: 40}} onPress={() => props.navigation.navigate('SeedPhrase')}>Back up Recovery Phrase Again</Text> */}
            </View>
        </Box>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        borderTopWidth: 200,
        borderTopColor: '#FAD049',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'white'
    },
    container: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        textAlign: 'center',
        margin: 20,
        marginTop: -80,
        borderRadius: 10,
        shadowColor: 'rgba(31, 31, 31, 0.77)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: -10, // hack
        marginRight: -10,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    paragraph: {
        fontWeight: '400',
        fontSize: 16,
        marginTop: 20
    },
    btn: {
        width: 256,
        height: 50,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
        marginBottom: 20,
    },
    typo3: {
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.85,
        textTransform: 'capitalize',
        color: 'white'
    },
    icon: {
        width: 81,
        height: 65,
        marginBottom: 10
    },
});

export default PhraseBackupSuccess;