import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const scrollPositionInitialState = fromJS( {
    $targetElement: null
} );

export default function scrollPosition ( state = scrollPositionInitialState, action ) {
    switch ( action.type ) {
        case types.SET_SCROLL_POSITION:
            return state
                .set( '$targetElement', action.$targetElement )
                .set( 'position', action.position );

        default:
            return state;
    }
}
