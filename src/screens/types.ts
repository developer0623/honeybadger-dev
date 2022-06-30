export interface NavigationProps {
    navigation: {
        canGoBack: () => boolean;
        goBack: () => void;
        navigate: (target: string, params?: any) => void;
        replace: (target: string) => void;
        getParam: (key: String) => boolean;
        isFocused: () => boolean;
        addListener: (type: string, fn: (payload: any) => void) => void;
    };
}

export type ReceiveProps = NavigationProps;
export type SendAddressProps = NavigationProps;
export type WelcomeProps = NavigationProps;
export type LoadingProps = NavigationProps;
export type AccountProps = NavigationProps;
export type AccountSettingsProps = NavigationProps;
export type SendAmountProps = NavigationProps;
export type SendFirstTimeProps = NavigationProps;
export type SendReviewProps = NavigationProps;
export type SettingsProps = NavigationProps;
export type SeedPhraseProps = NavigationProps;
export type DelegateAddressProps = NavigationProps;
export type DelegateReviewProps = NavigationProps;
export type BeaconProps = NavigationProps;
