import {
    SetNFTCollection,
    SetNFTCollectionLoading,
    SetNFTSelected,
    SetNFTGalleryView,
    SetNFTSendDetails,
} from './types';

export const SET_NFT_COLLECTION = 'GET_NFT_COLLECTION';
export const SET_NFT_COLLECTION_LOADING = 'SET_NFT_COLLECTION_LOADING';
export const SET_NFT_SELECTED = 'SET_NFT_SELECTED';
export const SET_NFT_GALLERY_VIEW = 'SET_NFT_GALLERY_VIEW';
export const SET_NFT_SEND_DETAILS = 'SET_NFT_SEND_DETAILS';

export const setNFTSendDetails = (
    sendQty: number = 1,
    sendAddress: string = '',
): SetNFTSendDetails => ({
    type: SET_NFT_SEND_DETAILS,
    sendQty,
    sendAddress,
});

export const setNFTGalleryView = (
    galleryView: number = 0,
): SetNFTGalleryView => ({
    type: SET_NFT_GALLERY_VIEW,
    galleryView,
});

export const setNFTCollection = (
    collected: any = [],
    minted: any = [],
): SetNFTCollection => ({
    type: SET_NFT_COLLECTION,
    collected,
    minted,
});

export const setNFTCollectionLoading = (
    collectionLoading: boolean = false,
): SetNFTCollectionLoading => ({
    type: SET_NFT_COLLECTION_LOADING,
    collectionLoading,
});

export const setNFTSelected = (selected: any = null): SetNFTSelected => ({
    type: SET_NFT_SELECTED,
    selected,
});
