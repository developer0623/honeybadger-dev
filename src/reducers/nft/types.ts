import {
    SET_NFT_COLLECTION,
    SET_NFT_COLLECTION_LOADING,
    SET_NFT_SELECTED,
    SET_NFT_GALLERY_VIEW,
    SET_NFT_SEND_DETAILS,
} from './actions';

export interface NFTState {
    collected: any;
    minted: any;
    collectionLoading: boolean;
    selected: any;
    galleryView: number;
    sendQty: number;
    sendAddress: string;
}

export interface SetNFTSendDetails {
    type: typeof SET_NFT_SEND_DETAILS;
    sendQty: number;
    sendAddress: string;
}

export interface SetNFTGalleryView {
    type: typeof SET_NFT_GALLERY_VIEW;
    galleryView: number;
}

export interface SetNFTCollection {
    type: typeof SET_NFT_COLLECTION;
    collected: any;
    minted: any;
}

export interface SetNFTCollectionLoading {
    type: typeof SET_NFT_COLLECTION_LOADING;
    collectionLoading: boolean;
}

export interface SetNFTSelected {
    type: typeof SET_NFT_SELECTED;
    selected: any;
}

export type NFTActions =
    | SetNFTCollection
    | SetNFTCollectionLoading
    | SetNFTSelected
    | SetNFTGalleryView
    | SetNFTSendDetails;
