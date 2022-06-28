interface IconStyles {
    size: number;
    color: string;
}

export interface CustomHeaderProps {
    title?: string;
    leftIconName?: string;
    rightIconName?: string;
    closeIconCustomStyles?: IconStyles;
    backIconCustomStyles?: IconStyles;
    onBack?: () => void;
    onClose?: () => void;
    RightComponent?: any;
}
