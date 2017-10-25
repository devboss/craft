import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const mobileMenuInitialState = fromJS( {
    isOpen: false
} );

export default function mobileMenu ( state = mobileMenuInitialState, action ) {
    switch ( action.type ) {
        case types.TOGGLE_MOBILE_MENU:
            const isOpen = state.get( 'isOpen' );
            return state.set( 'isOpen', !isOpen );

        default:
            return state;
    }
}
