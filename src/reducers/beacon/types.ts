import {BeaconErrorMessage} from '../../beacon/types';

import {
    SET_BEACON_STATUS,
    SET_BEACON_MESSAGE,
    SET_BEACON_PERMISSIONS,
    SET_BEACON_PEERS,
    SET_BEACON_METADATA,
    SET_BEACON_LOADING,
    SET_BEACON_ERROR_MESSAGE,
} from './actions';

export interface BeaconState {
    beaconMessage: any;
    beaconPermissions: any;
    beaconPeers: any;
    beaconMetadata: any;
    beaconLoading: boolean;
    beaconErrorMessage: BeaconErrorMessage | null;
    beaconReady: boolean;
}

export interface BeaconStatusAction {
    type: typeof SET_BEACON_STATUS;
    beaconReady: boolean;
}
export interface BeaconErrorMessageAction {
    type: typeof SET_BEACON_ERROR_MESSAGE;
    beaconErrorMessage: BeaconErrorMessage | null;
}
export interface BeaconLoadingAction {
    type: typeof SET_BEACON_LOADING;
    beaconLoading: boolean;
}
export interface BeaconMessageAction {
    type: typeof SET_BEACON_MESSAGE;
    beaconMessage: any;
}

export interface BeaconPermissionsAction {
    type: typeof SET_BEACON_PERMISSIONS;
    beaconPermissions: any;
}

export interface BeaconPeersAction {
    type: typeof SET_BEACON_PEERS;
    beaconPeers: any;
}

export interface BeaconMetadataAction {
    type: typeof SET_BEACON_METADATA;
    beaconMetadata: any;
}

export type BeaconActions =
    | BeaconStatusAction
    | BeaconMessageAction
    | BeaconPermissionsAction
    | BeaconPeersAction
    | BeaconMetadataAction
    | BeaconLoadingAction
    | BeaconErrorMessageAction;
