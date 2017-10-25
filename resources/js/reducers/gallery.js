import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const galleryInitialState = fromJS( {
    polaroids: [],
    scrollPolling: true,
    activePolaroidIndex: -1
} );

export default function gallery ( state = galleryInitialState, action ) {
    switch ( action.type ) {
        case types.ADD_GALLERY_POLAROIDS:
            return state
                .set( 'polaroids', fromJS( action.arr ) );

        case types.SET_GALLERY_ACTIVE_POLAROID_INDEX:
            return state
                .set( 'activePolaroidIndex', action.index )
                .set( 'scrollPolling', false );

        case types.SET_GALLERY_SCROLL_POLLING:
            return state.set( 'scrollPolling', action.active );

        default:
            return state;
    }
}
