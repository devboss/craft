import $ from 'jquery';
import AbstractStateContextComponent from './AbstractStateContextComponent';
import BookTablet from './BookTablet';
import BookMobile from './BookMobile';
import { addBook, setBookMode, showBook } from '../actions/bookActions';
import { compareState } from '../utils/stateHelpers';
import { readImageSources } from '../utils/bookImageHelpers';
import lazySizes from 'lazysizes';
import picturefill from 'picturefill';

export default class Book extends AbstractStateContextComponent {

    constructor ( ...args ) {
        super( ...args );

        this.name = this.$element.attr( 'data-name' );

        this.$imgs = this.$element.find( '.page__image' );
        this.$imgs.one( 'load', e => {
            picturefill( {
                reevaluate: true,
                elements: [ e.currentTarget ]
            } );
        } );

        this.buildDataStructure();

        this.mediaQueryManager.addListener( () => {
            this.dispatch( setBookMode( this.mediaQueryManager.matches( 'largeUp' ) ) );
        } );
    }

    buildDataStructure () {
        const $allFrontPages = this.$element.find( '.page__side--front' );
        const $cover = $allFrontPages.first();
        const $frontPages = $allFrontPages.not( $cover );
        const $backPages = this.$element.find( '.page__side--back' );

        // currentPageIndex refers to the page on the left hand side
        const currentPageIndex = -1;
        const pageNames = $backPages
            .get()
            .map( el => $( el ).attr( 'data-name' ) )
            .filter( name => name !== undefined );

        const getAnimations = $el => {
            // if we use map on jQuery object empty arrays are ignored
            const arr = $el.get();

            return arr
                .map( el => {
                    return $( el ).find( '[data-class="DrawAnimation"]' )
                        .map( ( index, el ) => {
                            return $( el ).attr( 'data-name' );
                        } )
                        .get();
                } );
        };

        const backAnimations = getAnimations( $backPages );
        const frontAnimations = getAnimations( $frontPages );

        const pageAnimations = backAnimations.map( ( animations, index ) => {
            return animations.concat( frontAnimations[ index ] );
        } );

        this.pageImages = $frontPages
            .get()
            .map( ( el, index ) => {
                const $frontImages = $( el ).find( '.page__image' );
                const $backImages = $backPages.eq( index ).find( '.page__image' );

                return $frontImages.get().concat( $backImages.get() );
            } );

        const pageImageSources = this.pageImages
            .map( images => images
                .map( img => readImageSources( $( img ) ) ) );

        this.coverImages = $cover
            .find( '.page__image' )
            .get();

        const coverImageSources = this.coverImages
            .map( img => readImageSources( $( img ) ) );

        // slightly awkward hack to include cover in pages List
        const pages = pageNames.map( ( name, index ) => ( {
            name,
            pageIndex: index,
            images: pageImageSources[ index ],
            animations: pageAnimations[ index ],
            mobileImagesLoaded: false,
            tabletImagesLoaded: false
        } ) );

        pages.unshift( {
            name: 'cover',
            pageIndex: -1,
            images: coverImageSources,
            animations: [],
            mobileImagesLoaded: true,
            tabletImagesLoaded: false
        } );

        // set initial state of this book, this won't trigger any state changes as listeners are only attached after
        // components are instantiated
        this.dispatch( addBook( this.name, currentPageIndex, pages ) );
    }

    storeRegistered () {
        // this triggers this initial instantiation of components
        this.dispatch( setBookMode( this.mediaQueryManager.matches( 'largeUp' ) ) );
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'books', 'isTablet' ], this.setCurrentState, this );

        // passes app state down to current state-pattern state
        super.onStateChanged( newState, oldState );

        // unveil lazyloaded images as page loads are triggered in showBook action
        compareState( newState, oldState, [ 'books', this.name, 'pages' ], ( newPages, oldPages ) => {
            const pageIndices = newPages
                .filter( ( page, index ) => {
                    const isMobileLoaded = page.get( 'mobileImagesLoaded' );
                    const isTabletLoaded = page.get( 'tabletImagesLoaded' );
                    const wasMobileLoaded = oldPages.get( index ).get( 'mobileImagesLoaded' );
                    const wasTabletLoaded = oldPages.get( index ).get( 'tabletImagesLoaded' );

                    return ( isMobileLoaded && !wasMobileLoaded ) || ( isTabletLoaded && !wasTabletLoaded );
                } )
                .map( page => page.get( 'pageIndex' ) );

            pageIndices.forEach( index => {
                const images = index === -1 ? this.coverImages : this.pageImages[ index ];
                images.forEach( el => lazySizes.loader.unveil( el ) );
            } );
        } );
    }

    isOpen () {
        const overlays = this.stateGet( 'overlays' );
        const thisOverlay = overlays.find( overlay => overlay.get( 'name' ) === this.name );
        return thisOverlay && thisOverlay.get( 'isOpen' );
    }

    setCurrentState ( isTablet, wasTablet ) {
        // if we're switching breakpoints, trigger the showBook action to load images
        if ( wasTablet !== null && this.isOpen() ) {
            const book = this.stateGet( [ 'books', this.name ] );
            const pageIndex = book.get( 'currentPageIndex' );
            const page = book.get( 'pages' )
                .find( page => page.get( 'pageIndex' ) === pageIndex );

            const pageName = page ? page.get( 'name' ) : null;

            this.dispatch( showBook( this.name, pageName ) );
        }

        if ( isTablet ) {
            this.setState( new BookTablet( this, this.name ) );
        }
        else {
            this.setState( new BookMobile( this, this.name ) );
        }

        this.onResize();
    }
}
