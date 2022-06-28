import React, {ReactNode} from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';

interface Props {
    children?: ReactNode
    // any props that come into the component
}

const SafeContainer = ({children}: Props) => {
    return (
        <SafeAreaView>
            <View style={styles.container}>{children}</View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
});

export default SafeContainer;
