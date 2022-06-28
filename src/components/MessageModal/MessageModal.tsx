import React from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import {View, Text, Icon} from 'native-base';

import {removeMessage} from '../../reducers/messages/actions';
import {State} from '../../reducers/types';

const MessageModal = () => {
    const message = useSelector(({messages}: State) => messages.message);
    const kind = useSelector(({messages}: State) => messages.kind);
    const dispatch = useDispatch();
    const onClose = () => dispatch(removeMessage());
    const getIconStyles = (kind: string) => {
        switch (kind) {
            case 'info':
                return [styles.icon, styles.info];
            case 'warning':
                return [styles.icon, styles.warning];
            case 'error':
                return [styles.icon, styles.error];
            default:
                return [styles.icon];
        }
    };
    const getIconProps = (
        kind: string,
    ): {name: string; type: 'AntDesign' | 'MaterialIcons'} => {
        if (kind === 'error' || kind === 'warning') {
            return {
                name: 'warning',
                type: 'AntDesign',
            };
        }
        return {
            name: 'info-outline',
            type: 'MaterialIcons',
        };
    };
    return (
        <Modal isVisible={message.length > 0} onBackdropPress={onClose}>
            <View style={styles.container}>
                {kind.length > 0 && (
                    <Icon {...getIconProps(kind)} style={getIconStyles(kind)} />
                )}
                <Text style={styles.message}>{message}</Text>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        borderRadius: 26,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    message: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        fontWeight: 'normal',
        letterSpacing: 0,
        color: '#000000',
    },
    messageKind: {
        color: '#ffffff',
    },
    icon: {
        fontSize: 20,
        alignSelf: 'center',
        marginRight: 5,
    },
    info: {
        color: 'blue',
    },
    warning: {
        color: 'orange',
    },
    error: {
        color: 'red',
    },
});

export default MessageModal;
