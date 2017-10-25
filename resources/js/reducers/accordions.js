import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const accordionsInitialState = fromJS( {} );

export default function accordions ( state = accordionsInitialState, action ) {
    switch ( action.type ) {
        case types.ADD_ACCORDION:
            return state.set( action.name, fromJS( {
                currentOpenIndex: -1
            } ) );

        case types.TOGGLE_ACCORDION_INDEX:
            const currentOpenIndex = state.getIn( [ action.name, 'currentOpenIndex' ] );
            const nextIndex = currentOpenIndex === action.index ? -1 : action.index;

            return state.setIn( [ action.name, 'currentOpenIndex' ], nextIndex );

        default:
            return state;
    }
}
