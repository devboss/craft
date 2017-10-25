import * as types from '../constants/actionTypes';
import { openOverlay, closeOverlay } from './actions';
import { showLoader, hideLoader } from './loaderActions';
import { loadPagesImages } from '../utils/bookImageHelpers';

export const addBook = ( name, currentPageIndex, pages ) => ( { type: types.ADD_BOOK, name, currentPageIndex, pages } );
export const setCurrentBook = ( bookName, pageName = null ) => ( { type: types.SET_CURRENT_BOOK, bookName, pageName } );
export const setBookPageLoaded = ( bookName, pageName, breakpoint ) => ( { type: types.SET_BOOK_PAGE_LOADED, bookName, breakpoint, pageName } );
export const setBookPerspective = ( perspective ) => ( { type: types.SET_BOOK_PERSPECTIVE, perspective } );
export const setBookMode = isTablet => ( { type: types.SET_BOOK_MODE, isTablet } );

export const showBook = ( bookName, pageName = null ) => {
    return ( dispatch, getState ) => {
        dispatch( openOverlay( bookName ) );

        const state = getState();
        const pages = state.getIn( [ 'books', bookName, 'pages' ] );

        const isTablet = state.getIn( [ 'books', 'isTablet' ] );
        const breakpoint = isTablet ? 'tablet' : 'mobile';

        let pagesToLoad = pages;

        if ( !isTablet ) {
            let pageIndex = 0;

            if ( pageName !== null ) {
                pageIndex = pages
                    .find( page => page.get( 'name' ) === pageName )
                    .get( 'pageIndex' );
            }

            pagesToLoad = pages
                .filter( page => page.get( 'pageIndex' ) === pageIndex );
        }

        const imagesLoaded = pagesToLoad
            .reduce( ( acc, page ) => acc && page.get( breakpoint + 'ImagesLoaded' ), true );

        if ( imagesLoaded ) {
            dispatch( setCurrentBook( bookName, pageName ) );
            return;
        }

        dispatch( showLoader() );

        loadPagesImages(
            pagesToLoad,
            breakpoint,
            pageIndex => {
                const pageName = pages
                    .find( page => page.get( 'pageIndex' ) === pageIndex )
                    .get( 'name' );

                dispatch( setBookPageLoaded( bookName, pageName, breakpoint ) );
            },
            () => {
                dispatch( hideLoader() );

                setTimeout( () => {
                    // bit hacky but give the loader time to hide for smoother animation
                    dispatch( setCurrentBook( bookName, pageName ) );
                }, 600 );
            }
        );
    };
};

export const hideBook = ( bookName ) => {
    return dispatch => {
        dispatch( closeOverlay( bookName ) );
        dispatch( setCurrentBook( null ) );
    };
};
