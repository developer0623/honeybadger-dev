import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Center, Box, Container, Text, View} from 'native-base';
import ProgressCircle from 'react-native-progress-circle';
import * as Keychain from 'react-native-keychain';
import {useDispatch, useSelector} from 'react-redux';

import {KeyStoreUtils} from '../softsigner';
import {setKeysAction} from '../reducers/app/actions';

import Checkmark from '../../assets/checkmark.svg';

import {State} from '../reducers/types';
import {LoadingProps} from './types';

const Loading = ({navigation}: LoadingProps) => {
    const termsDate = useSelector((state: State) => state.app.termsDate);
    const [ready, setReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        async function save() {
            try {
                if (termsDate) {
                    // const keys = await KeyStoreUtils.generateIdentity();
                    // await Keychain.resetGenericPassword();
                    // await Keychain.setGenericPassword(
                    //     'newwallet',
                    //     JSON.stringify({...keys, termsDate}),
                    // );
                    // dispatch(setKeysAction(keys));
                    // setReady(true);
                }
            } catch (e) {
                console.log('[ERROR]', e);
            }
        }
        save();
    }, []);

    useEffect(() => {
        if (ready && progress === 100) {
            setTimeout(() => {
                // navigation.replace('AccountSetup');
            }, 2000);
        }

        if (ready && progress >= 90) {
            setProgress(100);
            return;
        }

        if (progress >= 90) {
            return;
        }

        setTimeout(() => {
            const newProgress = progress + 15;
            setProgress(newProgress);
        }, 600);
    }, [progress, ready]);

    return (
        <Box style={styles.container}>
            <View style={styles.item}>
                <ProgressCircle
                    percent={progress}
                    radius={100}
                    borderWidth={3}
                    color="#4b4b4b"
                    shadowColor="#ff8f00"
                    bgColor="#fcd104">
                    <Text style={styles.typo1}>
                        {progress === 100 ? (
                            <View style={styles.icon}>
                                <Checkmark />
                            </View>
                        ) : (
                            'preparing account...'
                        )}
                    </Text>
                </ProgressCircle>
            </View>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fcd104',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    item: {
        marginBottom: 100,
    },
    icon: {
        width: 81,
        height: 65,
    },
    typo1: {
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        fontWeight: 'normal',
        lineHeight: 42,
        color: 'rgb(26, 25, 25)',
    },
});

export default Loading;
