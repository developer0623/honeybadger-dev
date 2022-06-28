import {State as AppState} from './app/types';
import {MessagesState} from './messages/types';
import {BeaconState} from './beacon/types';
import {NFTState} from './nft/types';

export interface State {
    app: AppState;
    messages: MessagesState;
    beacon: BeaconState;
    nft: NFTState;
}

export interface Operation {
    timestamp: number;
    kind: string; // TODO: enum
    source: string;
    destination: string;
    amount?: number;
    opGroupHash: string;
    delegate?: string;
    entrypoint?: string;
    //status: string;
}

export interface BakerInfo {
    address: string;
    name: string;
    logoUrl: string;
    fee: number;
    estimatedRoi: number;
}
