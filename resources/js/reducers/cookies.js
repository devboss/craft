import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const cookiesInitialState = fromJS( {
    accepted: window.localStorage.getItem( 'cookiesAccepted' ) === 'true'
} );

export default function cookies ( state = cookiesInitialState, action ) {
    switch ( action.type ) {
        case types.SET_COOKIES_ACCEPTED:
            return state.set( 'accepted', action.accepted );

        default:
            return state;
    }
}
