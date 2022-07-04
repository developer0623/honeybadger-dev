import React, {useEffect} from 'react';
import {NativeBaseProvider, Box} from 'native-base';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {MenuProvider} from 'react-native-popup-menu';

import MainNavigator from './navigation/MainNavigator';
import MessageModal from './components/MessageModal';
import store from './store';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

export default function App() {
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide();
        }, 3000);
    }, []);
    return (
        <Provider store={store}>
            <NativeBaseProvider>
                <MenuProvider>
                    <MainNavigator />
                    <MessageModal />
                </MenuProvider>
            </NativeBaseProvider>
        </Provider>
    );
}
