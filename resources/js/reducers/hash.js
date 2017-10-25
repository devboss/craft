import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const hashInitialState = fromJS( {
    value: ''
} );

export default function hash ( state = hashInitialState, action ) {
    switch ( action.type ) {
        case types.SET_HASH:
            return state.set( 'value', action.hash );

        default:
            return state;
    }
}
