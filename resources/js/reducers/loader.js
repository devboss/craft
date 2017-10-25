import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const loaderInitialState = fromJS( {
    isReady: false,
    loadCount: 0
} );

export default function overlays ( state = loaderInitialState, action ) {
    switch ( action.type ) {
        case types.SET_LOADER_READY:
            return state.set( 'isReady', true );

        case types.INCREMENT_LOAD_COUNT:
            return state.set( 'loadCount', state.get( 'loadCount' ) + 1 );

        case types.DECREMENT_LOAD_COUNT:
            const loadCount = state.get( 'loadCount' );

            if ( loadCount === 0 ) {
                return state;
            }

            return state.set( 'loadCount', loadCount - 1 );

        default:
            return state;
    }
}
