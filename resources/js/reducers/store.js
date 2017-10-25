import { Map } from 'immutable';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './index';
import * as types from '../constants/actionTypes';

// https://github.com/reactjs/redux/issues/911#issuecomment-149361073
function enableBatching ( reducer ) {
    return function batchingReducer ( state, action ) {
        switch ( action.type ) {
            case types.BATCH_ACTIONS:
                return action.actions.reduce( batchingReducer, state );

            default:
                return reducer( state, action );
        }
    };
}

let enhancers = applyMiddleware( thunk );

if ( window.__REDUX_DEVTOOLS_EXTENSION__ ) {
    enhancers = compose(
        enhancers,
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );
}

const initialState = Map( {} );
const store = createStore(
    enableBatching( rootReducer ),
    initialState,
    enhancers
);

export default store;
