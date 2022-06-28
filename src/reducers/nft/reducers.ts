import {
    SET_NFT_COLLECTION,
    SET_NFT_COLLECTION_LOADING,
    SET_NFT_SELECTED,
    SET_NFT_GALLERY_VIEW,
    SET_NFT_SEND_DETAILS,
} from './actions';
import {NFTState, NFTActions} from './types';

const initialState = {
    collected: [],
    minted: [],
    collectionLoading: false,
    selected: null,
    galleryView: 0,
    sendQty: 1,
    sendAddress: '',
};

const nft = (state: NFTState = initialState, action: NFTActions) => {
    switch (action.type) {
        case SET_NFT_SEND_DETAILS:
            return {
                ...state,
                sendQty: action.sendQty,
                sendAddress: action.sendAddress,
            };
        case SET_NFT_GALLERY_VIEW:
            return {...state, galleryView: action.galleryView};
        case SET_NFT_COLLECTION:
            return {
                ...state,
                collected: action.collected,
                minted: action.minted,
            };
        case SET_NFT_COLLECTION_LOADING:
            return {...state, collectionLoading: action.collectionLoading};
        case SET_NFT_SELECTED:
            return {...state, selected: action.selected};
        default:
            return state;
    }
};

export default nft;
