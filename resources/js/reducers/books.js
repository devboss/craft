import { fromJS } from 'immutable';
import * as types from '../constants/actionTypes';

const booksInitialState = fromJS( {
    currentBook: null,
    perspective: 0,
    isTablet: null
} );

export default function books ( state = booksInitialState, action ) {
    switch ( action.type ) {
        case types.ADD_BOOK:
            return state.set( action.name, fromJS( {
                currentPageIndex: action.currentPageIndex,
                pages: action.pages
            } ) );

        case types.SET_BOOK_MODE:
            return state.set( 'isTablet', action.isTablet );

        case types.SET_BOOK_PAGE_LOADED:
            const pageIndex = state
                .getIn( [ action.bookName, 'pages' ] )
                .findIndex( page => page.get( 'name' ) === action.pageName );

            const key = action.breakpoint + 'ImagesLoaded';

            return state.setIn( [ action.bookName, 'pages', pageIndex, key ], true );

        case types.SET_BOOK_PERSPECTIVE:
            return state.set( 'perspective', action.perspective );

        case types.SET_CURRENT_BOOK:
            const bookName = action.bookName === null ? state.get( 'currentBook' ) : action.bookName;
            const nextBookName = action.bookName;
            const pageName = action.pageName;

            const newState = state.set( 'currentBook', nextBookName );

            // TODO: logic might be better in an action creator!
            if ( !bookName ) {
                // if starting with an empty hash bookName can be null
                return newState;
            }

            let nextIndex;

            if ( nextBookName === null ) {
                // we're closing the book so allow going to -1 (closed book)
                nextIndex = -1;
            }
            else {
                const pages = state.getIn( [ bookName, 'pages' ] );
                const page = pages.find( page => page.get( 'name' ) === pageName );

                nextIndex = page ? page.get( 'pageIndex' ) : 0;
            }

            return newState.setIn( [ bookName, 'currentPageIndex' ], nextIndex );

        default:
            return state;
    }
}
