export interface CustomButtonProps {
    label: string;
    icon: string;
    size?: number;
    color?: string;
    tooltip?: boolean;
    onPress?: () => Promise<void | undefined> | void | undefined;
}
