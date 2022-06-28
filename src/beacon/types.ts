export interface BeaconErrorMessage {
    type: string;
    message: string;
}

export enum BeaconErrorTypes {
    ADD_PEER_ERROR = 'ADD_PEER_ERROR',
    ABORTED_ERROR = 'ABORTED_ERROR'
}

export enum BeaconMessageTypes {
    PERMISSION_REQUEST = 'permission_request',
    OPERATION_REQUEST = 'operation_request',
    ERROR = 'error',
    OPERATION_RESPONSE = 'operation_response'
}

export enum BeaconSuccessTypes {
    PERMISSION_SUCCESS = 'permission_success',
    GET_PERMISSIONS = 'get_permissions',
    GET_PEERS = 'get_peers',
    GET_APP_METADATA = 'get_app_metadata',
    START_BEACON = 'start_beacon',
}

export enum BeaconPermissionScopes {
    sign = 'Sign',
    operation_request = 'Operation Request',
}
