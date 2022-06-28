import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'native-base';

import CustomButton from '../CustomButton';

interface EnterAddressButtonsProps {
    isVisible: boolean;
    onPasteAddress: () => void;
    onScanQrCode: () => void;
}

const EnterAddressButtons = ({
    isVisible,
    onPasteAddress,
    onScanQrCode,
}: EnterAddressButtonsProps) => {
    return (
        <>
            {isVisible && (
                <View style={styles.container}>
                    <View>
                        <CustomButton
                            icon="Paste"
                            label="Paste Address"
                            color="#f5942a"
                            onPress={onPasteAddress}
                        />
                    </View>
                    <View style={styles.vr} />
                    <View>
                        <CustomButton
                            icon="Scan"
                            label="Scan QR Code"
                            color="#f5942a"
                            onPress={onScanQrCode}
                        />
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 'auto',
        paddingVertical: 42,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
    },
    vr: {
        width: 1,
        backgroundColor: '#e8e8e8',
        marginHorizontal: 50,
    },
});

export default EnterAddressButtons;
