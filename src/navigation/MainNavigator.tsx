import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import { Box } from 'native-base';
import WelcomeScreen from '../screens/Welcome';
import TermsScreen from '../screens/Terms';
import LoadingScreen from '../screens/Loading';
import AccountScreen from '../screens/Account';
import ReceiveScreen from '../screens/Receive';
import SendAddressScreen from '../screens/SendAddress';
import SendAmountScreen from '../screens/SendAmount';
import SendReviewScreen from '../screens/SendReview';
import SendFirstTimeScreen from '../screens/SendFirstTime';
import SettingsScreen from '../screens/Settings';
import SeedPhraseScreen from '../screens/SeedPhrase';
import DelegateAddressScreen from '../screens/DelegateAddress';
import DelegateReviewScreen from '../screens/DelegateReview';
import AccountSetup from '../screens/AccountSetup';
import ResetPin from '../screens/ResetPin';
import SecurityLevel from '../screens/SecurityLevel';
import RecoveryPhrase from '../screens/RecoveryPhrase';
import RestoreAccount from '../screens/RestoreAccount';
import BeaconConnectionRequest from '../beacon/screens/BeaconConnectionRequest';
import BeaconPermissionsRequest from '../beacon/screens/BeaconPermissionsRequest';
import BeaconAuthorization from '../beacon/screens/BeaconAuthorization';
import BeaconInfo from '../beacon/screens/BeaconInfo';
import NFTGallery from '../screens/NFTGallery';
import NFTGalleryView from '../screens/NFTGalleryView';
import NFTDetails from '../screens/NFTDetails';
import NFTSend from '../screens/NFTSend';
import NFTConfirm from '../screens/NFTConfirm';

type RootStackParamList = {
    Welcome: undefined;
    Terms: undefined;
    Loading: undefined;
    Account: undefined;
    AccountSetup: undefined;
    Receive: undefined;
    SendAddress: undefined;
    SendAmount: undefined;
    SendReview: undefined;
    SendFirstTime: undefined;
    Settings: undefined;
    SeedPhrase: undefined;
    DelegateAddress: undefined;
    DelegateReview: undefined;
    ResetPin: undefined;
    SecurityLevel: undefined;
    RecoveryPhrase: undefined;
    RestoreAccount: undefined;
    BeaconConnectionRequest: undefined;
    BeaconPermissionsRequest: undefined;
    BeaconAuthorization: undefined;
    BeaconInfo: undefined;
    NFTGallery: undefined;
    NFTGalleryView: undefined;
    NFTDetails: undefined;
    NFTSend: undefined;
    NFTConfirm: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Terms" component={TermsScreen} />
                <Stack.Screen name="Loading" component={LoadingScreen} />
                <Stack.Screen name="Account" component={AccountScreen} />
                <Stack.Screen name="AccountSetup" component={AccountSetup} />
                <Stack.Screen name="Receive" component={ReceiveScreen} />
                <Stack.Screen name="SendAddress" component={SendAddressScreen} />
                <Stack.Screen name="SendAmount" component={SendAmountScreen} />
                <Stack.Screen name="SendReview" component={SendReviewScreen} />
                <Stack.Screen name="SendFirstTime" component={SendFirstTimeScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="SeedPhrase" component={SeedPhraseScreen} />
                <Stack.Screen name="DelegateAddress" component={DelegateAddressScreen} />
                <Stack.Screen name="DelegateReview" component={DelegateReviewScreen} />
                <Stack.Screen name="ResetPin" component={ResetPin} />
                <Stack.Screen name="SecurityLevel" component={SecurityLevel} />
                <Stack.Screen name="RecoveryPhrase" component={RecoveryPhrase} />
                <Stack.Screen name="RestoreAccount" component={RestoreAccount} />
                <Stack.Screen name="BeaconConnectionRequest" component={BeaconConnectionRequest} />
                <Stack.Screen name="BeaconPermissionsRequest" component={BeaconPermissionsRequest} />
                <Stack.Screen name="BeaconAuthorization" component={BeaconAuthorization} />
                <Stack.Screen name="BeaconInfo" component={BeaconInfo} />
                <Stack.Screen name="NFTGallery" component={NFTGallery} />
                <Stack.Screen name="NFTGalleryView" component={NFTGalleryView} />
                <Stack.Screen name="NFTDetails" component={NFTDetails} />
                <Stack.Screen name="NFTSend" component={NFTSend} />
                <Stack.Screen name="NFTConfirm" component={NFTConfirm} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// export default createAppContainer(MainNavigator);
