import React, {useState, FunctionComponent} from 'react';
import {StyleSheet, Clipboard} from 'react-native';
import {Text, View, Input, Item} from 'native-base';

import CustomHeader from '../CustomHeader';
import EnterAddressCamera from './EnterAddressCamera';
import EnterAddressErrors from './EnterAddressErrors';
import EnterAddressButtons from './EnterAddressButtons';

interface EnterAddressProps {
    headerTitle: string;
    addressTitle: string;
    goBack: () => void;
    validateAddress: (value: string) => void;
    onValidAddress: (value: string, valid: boolean) => void;
}

const EnterAddress: FunctionComponent<EnterAddressProps> = ({
    headerTitle,
    addressTitle,
    children,
    goBack,
    validateAddress,
    onValidAddress,
}) => {
    const [isValid, setIsValid] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [address, setAddress] = useState('');
    const [showCamera, setShowCamera] = useState(false);

    const onAddressTextChange = async (value: string) => {
        setAddress(value);

        if (value.trim().length === 0) {
            return;
        }

        try {
            await validateAddress(value);
            setIsValid(true);
            setIsError(false);
            setErrorMessage('');
            onValidAddress(value, true);
        } catch (err) {
            setIsValid(false);
            setIsError(true);
            setErrorMessage(err.message);
            onValidAddress(value, false);
        }
    };
    const onPasteAddress = async () => {
        const copiedMessage = await Clipboard.getString();
        onAddressTextChange(copiedMessage);
    };
    const onScanQrCode = () => setShowCamera(true);
    const onBarcodeRecognized = ({data}: {data: string}) => {
        if (data && data.length) {
            onAddressTextChange(data);
            setShowCamera(false);
        }
    };
    return (
        <>
            <EnterAddressCamera
                open={showCamera}
                onBarcodeRecognized={onBarcodeRecognized}
                onBack={() => setShowCamera(false)}
            />
            {!showCamera && (
                <>
                    <CustomHeader title={headerTitle} onBack={goBack} />
                    <Text style={styles.title}>{addressTitle}</Text>
                    <View style={styles.address}>
                        <Item regular style={styles.item}>
                            <Input
                                placeholder="e.g tz1…"
                                style={styles.input}
                                onChangeText={onAddressTextChange}
                                value={address}
                                autoCompleteType="off"
                                autoCorrect={false}
                                autoCapitalize="none"
                                returnKeyType="next"
                            />
                        </Item>
                    </View>
                    {children}
                    <EnterAddressErrors
                        isVisible={isError}
                        title="Invalid Address"
                        message={errorMessage}
                    />
                    <EnterAddressButtons
                        isVisible={!isValid}
                        onPasteAddress={onPasteAddress}
                        onScanQrCode={onScanQrCode}
                    />
                </>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginTop: 59,
    },
    address: {
        marginTop: 24,
        marginHorizontal: 24,
    },
    item: {
        borderRadius: 20,
        borderColor: 'transparent',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingHorizontal: 16,
    },
    input: {
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        fontWeight: '300',
    },
});

export default EnterAddress;
