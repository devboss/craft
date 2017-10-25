import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const overlaysInitialState = fromJS( [] );

export default function overlays ( state = overlaysInitialState, action ) {
    switch ( action.type ) {
        case types.ADD_OVERLAY:
            return state.push( fromJS(
                Object.assign( {
                    name: action.name,
                    isOpen: false
                }, action.data )
            ) );

        case types.SET_OVERLAY_VIDEO_ID:
            const videoIndex = state.findIndex( overlay => overlay.get( 'name' ) === 'video' );
            return state
                .setIn( [ videoIndex, 'vimeoId' ], action.vimeoId )
                .setIn( [ videoIndex, 'isOpen' ], true );

        case types.SET_GALLERY_OVERLAY_SLIDE_INDEX:
            const galleryIndex = state.findIndex( overlay => overlay.get( 'name' ) === 'gallery' );
            return state.setIn( [ galleryIndex, 'slideIndex' ], action.slideIndex );

        case types.OPEN_OVERLAY:
            const openIndex = state.findIndex( overlay => overlay.get( 'name' ) === action.name );
            return state.setIn( [ openIndex, 'isOpen' ], true );

        case types.CLOSE_OVERLAY:
            const closeIndex = state.findIndex( overlay => overlay.get( 'name' ) === action.name );
            return state.setIn( [ closeIndex, 'isOpen' ], false );

        default:
            return state;
    }
}
