import React from 'react';
import {StyleSheet} from 'react-native';
import {RNCamera} from 'react-native-camera';

import CustomHeader from '../CustomHeader';

interface EnterAddressCamera {
    open: boolean;
    onBack: () => void;
    onBarcodeRecognized: ({data}: {data: string}) => void;
}

const EnterAddressCamera = ({
    open,
    onBarcodeRecognized,
    onBack,
}: EnterAddressCamera) => {
    const btn = {
        size: 30,
        color: '#ffffff',
    };
    return (
        <>
            {open && (
                <RNCamera
                    captureAudio={false}
                    style={styles.camera}
                    onBarCodeRead={onBarcodeRecognized}>
                    <CustomHeader
                        onBack={onBack}
                        leftIconName="Cancel"
                        backIconCustomStyles={btn}
                    />
                </RNCamera>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        width: '100%',
    },
});

export default EnterAddressCamera;
