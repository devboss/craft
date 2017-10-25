import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const videosInitialState = fromJS( [] );

export default function videos ( state = videosInitialState, action ) {
    switch ( action.type ) {
        case types.ADD_INLINE_VIDEO:
            return state.push( fromJS( {
                id: action.vimeoId,
                isPlaying: false,
                isReady: false,
                isTouched: false,
                shouldLoadPoster: false,
                isPosterLoaded: false
            } ) );

        case types.LOAD_INLINE_VIDEO_POSTER:
            const loadIndex = state
                .findIndex( video => video.get( 'id' ) === action.vimeoId );

            return state.setIn( [ loadIndex, 'shouldLoadPoster' ], true );

        case types.SET_INLINE_VIDEO_POSTER_LOADED:
            const loadedIndex = state
                .findIndex( video => video.get( 'id' ) === action.vimeoId );

            return state
                .setIn( [ loadedIndex, 'isPosterLoaded' ], true )
                .setIn( [ loadedIndex, 'shouldLoadPoster' ], true );

        case types.SET_INLINE_VIDEO_READY:
            const readyIndex = state
                .findIndex( video => video.get( 'id' ) === action.vimeoId );

            return state.setIn( [ readyIndex, 'isReady' ], true );

        case types.SET_INLINE_VIDEO_TOUCHED:
            const touchedIndex = state
                .findIndex( video => video.get( 'id' ) === action.vimeoId );

            return state.setIn( [ touchedIndex, 'isTouched' ], action.touched );

        case types.TOGGLE_PLAY_INLINE_VIDEO:
            return state.map( video => {
                if ( video.get( 'id' ) === action.vimeoId ) {
                    const state = video
                        .set( 'isPlaying', action.play );

                    if ( action.play ) {
                        return state.set( 'isTouched', true );
                    }

                    return state;
                }
                else if ( action.play ) {
                    return video.set( 'isPlaying', false );
                }

                return video;
            } );

        default:
            return state;
    }
}
