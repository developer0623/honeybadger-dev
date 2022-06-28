import {BeaconErrorMessage} from '../../beacon/types';

export const SET_BEACON_STATUS = 'SET_BEACON_STATUS';
export const SET_BEACON_MESSAGE = 'SET_BEACON_MESSAGE';
export const SET_BEACON_PERMISSIONS = 'SET_BEACON_PERMISSIONS';
export const SET_BEACON_PEERS = 'SET_BEACON_PEERS';
export const SET_BEACON_METADATA = 'SET_BEACON_METADATA';
export const SET_BEACON_LOADING = 'SET_BEACON_LOADING';
export const SET_BEACON_ERROR_MESSAGE = 'SET_BEACON_ERROR_MESSAGE';

export const setBeaconStatus = (beaconReady: boolean = false) => ({
    type: SET_BEACON_STATUS,
    beaconReady,
});

export const setBeaconMessage = (beaconMessage: any = {}) => ({
    type: SET_BEACON_MESSAGE,
    beaconMessage,
});

export const setBeaconPermissions = (beaconPermissions: any = []) => ({
    type: SET_BEACON_PERMISSIONS,
    beaconPermissions,
});

export const setBeaconPeers = (beaconPeers: any = []) => ({
    type: SET_BEACON_PEERS,
    beaconPeers,
});

export const setBeaconMetadata = (beaconMetadata: any = []) => ({
    type: SET_BEACON_METADATA,
    beaconMetadata,
});

export const setBeaconLoading = (beaconLoading: boolean = false) => ({
    type: SET_BEACON_LOADING,
    beaconLoading,
});

export const setBeaconErrorMessage = (
    beaconErrorMessage: BeaconErrorMessage | null = null,
) => ({
    type: SET_BEACON_ERROR_MESSAGE,
    beaconErrorMessage,
});
