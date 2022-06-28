import React, {useEffect, FunctionComponent, ReactElement} from 'react';
import {StyleSheet} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

interface CustomTooltipProps {
    isVisible: boolean;
    content: ReactElement;
    positions?: Record<'top' | 'right' | 'bottom' | 'left', number>;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    arrowStyles?: Record<string, string | number>;
    contentStyles?: Record<string, string | number>;
    onClose: () => void;
}

const CustomTooltip: FunctionComponent<CustomTooltipProps> = ({
    isVisible,
    content,
    positions,
    placement,
    arrowStyles,
    contentStyles,
    onClose,
    children,
}) => {
    const display = {
        top: 48,
        bottom: 90,
        left: 20,
        right: 100,
        ...positions,
    };
    useEffect(() => {
        if (isVisible) {
            setTimeout(() => {
                onClose();
            }, 600);
            return;
        }
    }, [isVisible, onClose]);
    return (
        <Tooltip
            isVisible={isVisible}
            accessible={false}
            arrowStyle={arrowStyles || styles.arrow}
            backgroundColor="transparent"
            contentStyle={contentStyles || styles.content}
            showChildInTooltip={false}
            content={content}
            placement={placement || 'bottom'}
            displayInsets={display}
            onClose={onClose}>
            {children}
        </Tooltip>
    );
};

const styles = StyleSheet.create({
    arrow: {
        display: 'none',
    },
    content: {
        width: 'auto',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
});

export default CustomTooltip;
