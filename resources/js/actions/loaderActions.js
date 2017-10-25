import * as types from '../constants/actionTypes';
import { openOverlay, closeOverlay } from './actions';

export const setLoaderReady = () => ( { type: types.SET_LOADER_READY } );
export const incrementLoadCount = () => {
    return { type: types.INCREMENT_LOAD_COUNT };
};

export const decrementLoadCount = () => ( { type: types.DECREMENT_LOAD_COUNT } );

export const showLoader = () => {
    return ( dispatch, getState ) => {
        const lastLoadCount = getState().getIn( [ 'loader', 'loadCount' ] );

        dispatch( incrementLoadCount() );

        if ( lastLoadCount === 0 ) {
            dispatch( openOverlay( 'loader' ) );
        }
    };
};

export const hideLoader = () => {
    return ( dispatch, getState ) => {
        dispatch( decrementLoadCount() );

        const loadCount = getState().getIn( [ 'loader', 'loadCount' ] );

        if ( loadCount === 0 ) {
            dispatch( closeOverlay( 'loader' ) );
        }
    };
};
