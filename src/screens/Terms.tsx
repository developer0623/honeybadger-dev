/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Text, Button, View, Box } from 'native-base';
import { useDispatch } from 'react-redux';
import Pdf from 'react-native-pdf';

import { setTermsDate } from '../reducers/app/actions';

import SafeContainer from '../components/SafeContainer';
import BottomCover from '../components/BottomCover';
import CustomHeader from '../components/CustomHeader';
import { colors } from '../theme';
import { WelcomeProps } from './types';

const sources = [
    {
        uri:
            'https://github.com/Cryptonomic/Deployments/raw/master/Terms_of_Service.pdf',
        cache: true,
    },
    {
        uri:
            'https://github.com/Cryptonomic/Deployments/raw/master/Privacy_Policy.pdf',
        cache: true,
    },
];

const Terms = ({ navigation }: WelcomeProps) => {
    const dispatch = useDispatch();
    const [tab, setTab] = useState(0);

    const getStarted = () => {
        dispatch(setTermsDate(new Date().toLocaleString()));
        navigation.replace('Loading');
    };
    const onCancel = () => navigation.replace('Welcome');

    const changeTab = (newTab: number) => {
        if (newTab === tab) {
            return;
        }

        setTab(newTab);
    };

    return (
        <Box style={styles.container}>
            <SafeContainer>
                <StatusBar backgroundColor="#fcd104" barStyle='light-content' />
                <CustomHeader title="Accept Terms" />
                <View style={styles.content}>
                    <View style={styles.tabs}>
                        <View
                            style={[
                                styles.tab,
                                tab === 0
                                    ? styles.tabBorderActive
                                    : styles.tabBorderInactive,
                            ]}>
                            <Button
                                style={styles.center}
                                variant="unstyled"
                                onPress={() => changeTab(0)}>
                                <Text
                                    style={[
                                        styles.typo1,
                                        tab === 0
                                            ? styles.tabActive
                                            : styles.tabInactive,
                                    ]}>
                                    Terms of Service
                                </Text>
                            </Button>
                        </View>
                        <View
                            style={[
                                styles.tab,
                                tab === 1
                                    ? styles.tabBorderActive
                                    : styles.tabBorderInactive,
                            ]}>
                            <Button
                                style={styles.center}
                                variant="unstyled"
                                onPress={() => changeTab(1)}>
                                <Text
                                    style={[
                                        styles.typo1,
                                        tab === 1
                                            ? styles.tabActive
                                            : styles.tabInactive,
                                    ]}>
                                    Privacy Policy
                                </Text>
                            </Button>
                        </View>
                    </View>
                    <Pdf
                        trustAllCerts={false}
                        source={sources[tab]}
                        scale={1.0}
                        onLoadComplete={(numberOfPages, filePath) => { }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        style={styles.pdf}
                    />
                    <View style={styles.actionsWrapper}>
                        <View style={styles.actions}>
                            <Button variant="unstyled" onPress={onCancel}>
                                <View style={styles.btn}>
                                    <Text style={styles.cancelText}>
                                        Cancel
                                    </Text>
                                </View>
                            </Button>
                            <Button variant="unstyled" onPress={getStarted}>
                                <View style={[styles.btn, styles.accept]}>
                                    <Text style={styles.acceptText}>
                                        Accept
                                    </Text>
                                </View>
                            </Button>
                        </View>
                    </View>
                </View>
            </SafeContainer>
            <BottomCover />
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
        paddingHorizontal: 10,
        paddingTop: 10,
        alignItems: 'center',
    },
    pdf: {
        flexGrow: 1,
        width: '100%',
    },
    tabs: {
        marginTop: 5,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tab: {
        borderBottomWidth: 3,
        borderRadius: 0,
        width: '50%',
        justifyContent: 'center',
    },
    tabContainer: {
        width: '90%',
    },
    tabActive: {
        color: 'rgba(0, 0, 0, 0.92)',
    },
    tabInactive: {
        color: 'rgb(125, 124, 124)',
    },
    tabBorderActive: {
        borderBottomColor: '#f1c20e',
    },
    tabBorderInactive: {
        borderBottomColor: '#e8e8e8',
    },
    center: {
        alignSelf: 'center',
    },
    actionsWrapper: {
        width: '100%',
        height: 70,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn: {
        width: 130,
        height: 45,
        borderColor: '#4b4b4b',
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    accept: {
        backgroundColor: '#4b4b4b',
    },
    acceptText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.85,
        color: '#ffffff',
    },
    cancelText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        letterSpacing: 0.75,
        color: '#4b4b4b',
    },
    typo1: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 27,
        textTransform: 'capitalize',
    },
});

export default Terms;
