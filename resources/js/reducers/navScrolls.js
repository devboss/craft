import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const navScrollsInitialState = fromJS( {
    openIndex: -1
} );

export default function navScrolls ( state = navScrollsInitialState, action ) {
    switch ( action.type ) {
        case types.SET_OPEN_SCROLL_INDEX:
            return state.set( 'openIndex', action.index );

        default:
            return state;
    }
}
