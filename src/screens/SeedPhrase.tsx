import React, { useState } from 'react';
import { StyleSheet, Clipboard, ScrollView } from 'react-native';
import { Box, View, Text, Container, Button } from 'native-base';
import { useSelector } from 'react-redux';

import CustomHeader from '../components/CustomHeader';
import CustomTooltip from '../components/CustomTooltip';
import CustomIcon from '../components/CustomIcon';
import { colors } from '../theme';

import { SeedPhraseProps } from './types';
import { State } from '../reducers/types';
import PhraseBackup from '../components/PhraseBackup';

const SeedPhrase = ({ navigation, route }: SeedPhraseProps) => {
    const seed = useSelector((state: State) => state.app.seed);
    const [copied, setCopied] = useState(false);
    const arr = seed.split(' ');
    const half = arr.length / 2;
    const cols = [arr.slice(0, half), arr.slice(half)];
    const [step, setStep] = useState(0);

    const onCopyToClipboard = () => {
        Clipboard.setString(seed);
        setCopied(true);
    };

    const handleBack = () => {
        if(route.params.fromSetting) {
            navigation.navigate("Settings")
        } else {
            navigation.navigate("SecurityLevel")
        }
    }

    return (
        <Box style={styles.container}>

            {step === 0 &&
                <React.Fragment>
                    <CustomHeader
                        title="Account Mnemonic"
                        onBack={() => handleBack()}
                    />
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.content}>
                            <View style={styles.title}>
                                <Text style={styles.typo1}>
                                    Carefully write down your recovery phrase and keep it in a safe place.
                                </Text>
                                <Text style={[styles.subtitle, styles.typo2]}>
                                    You will need it to access your funds in case your phone is lost or stolen. If anyone else gets access to your recovery phrase they will be able to steal your funds.
                                </Text>
                            </View>
                            <View style={styles.dividerHorizontal} />
                            <View style={styles.seed}>
                                <View style={styles.column}>
                                    {cols[0].map((value, index) => (
                                        <View style={styles.row} key={index}>
                                            <View style={styles.seedNumberWrapper}>
                                                <Text style={styles.seedNumber}>{`${index + 1
                                                    }`}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.seedText}>{value}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                                <View style={styles.dividerVertical} />
                                <View style={styles.column}>
                                    {cols[1].map((value, index) => (
                                        <View style={styles.row} key={index}>
                                            <View style={styles.seedNumberWrapper}>
                                                <Text style={styles.seedNumber}>{`${half + 1 + index
                                                    }`}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.seedText}>{value}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            {
                                !route.params.fromSetting &&
                                <Button style={styles.btn} onPress={() => setStep(1)}>
                                    <Text style={{color: 'white'}}>Next</Text>
                                </Button>
                            }

                        </View>
                    </ScrollView>
                </React.Fragment>
            }
            {
                step === 1 &&
                <PhraseBackup navigation={navigation} />
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
    },
    content: {
        backgroundColor: '#ffffff',
        flexGrow: 1,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingHorizontal: 40,
        paddingBottom: 70,
    },
    title: {
        marginTop: 25,
    },
    subtitle: {
        marginTop: 15,
    },
    seed: {
        flexDirection: 'row',
        marginTop: 25,
    },
    dividerHorizontal: {
        width: '100%',
        height: 1,
        backgroundColor: '#979797',
        marginTop: 23,
    },
    dividerVertical: {
        width: 1,
        height: '100%',
        backgroundColor: '#979797',
    },
    seedText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        color: 'rgba(0, 0, 0, .92)',
        lineHeight: 34,
        marginLeft: 5,
    },
    seedNumber: {
        fontFamily: 'Roboto-Light',
        fontWeight: '300',
        fontSize: 16,
        color: 'rgba(0, 0, 0, .92)',
        lineHeight: 34,
    },
    seedNumberWrapper: {
        width: 30,
    },
    column: {
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        width: '50%',
    },
    row: {
        width: 100,
        flexDirection: 'row',
    },
    action: {
        marginTop: 40,
        alignItems: 'center',
    },
    btn: {
        width: 300,
        height: 50,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    btnText: {
        color: '#ffffff',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        letterSpacing: 0.85,
    },
    tooltipContent: {
        width: 'auto',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    tooltipText: {
        marginLeft: 5,
    },
    typo1: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 26,
    },
    typo2: {
        fontFamily: 'Roboto-Light',
        fontSize: 16,
        fontWeight: '300',
        lineHeight: 22,
    },
});

export default SeedPhrase;
