import $ from 'jquery';
import TweenLite from 'TweenLite';
import Overlay from './Overlay';
import Book from './Book';
import { compareState } from '../utils/stateHelpers';
import { togglePlayInlineVideo, batchActions, loadInlineVideoPoster, setInlineVideoTouched } from '../actions/actions';

export default class BookOverlay extends Overlay {

    constructor ( ...args ) {
        super( ...args );

        this.book = this.findDescendantByClass( Book );
        this.bookName = this.book.name;

        this.$activeElements = this.$activeElements.concat( this.book.$element );

        this.inlineVideoIds = this.$element.find( '.inline-video' )
            .map( ( index, el ) => $( el ).attr( 'data-id' ) )
            .get();

        this.$content.on( 'click', this.onBackgroundClicked.bind( this ) );
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'books', 'isTablet' ], () => {
            this.transitionTime = this.$content.css( 'transitionDuration' )
                .split( ',' )
                .reduce( ( acc, time ) => {
                    let val = parseFloat( time );
                    val = time.indexOf( 'ms' ) > -1 ? val : val * 1000;

                    return Math.max( acc, val );
                }, 0 );
        } );

        compareState( newState, oldState, [ 'books', 'perspective' ], perspective => {
            if ( window.preserve3d ) {
                this.$element.css( 'perspective', perspective );
            }
        } );

        /**
         * When a book is requested this overlay's state is set to open, but the currentBook property isn't set on the
         * state until the required book images are loaded. Use this to trigger the css transition to show the book
         */
        compareState( newState, oldState, [ 'books', 'currentBook' ], currentBook => {
            const isBookVisible = currentBook === this.bookName;
            this.$element.toggleClass( '-book-visible', isBookVisible );
        } );

        // TODO: trigger this before load complete
        compareState( newState, oldState, [ 'books', this.name, 'currentPageIndex' ], nextPageIndex => {
            const isTablet = this.stateGet( [ 'books', 'isTablet' ] );

            if ( nextPageIndex > -1 && !isTablet ) {
                TweenLite.to( this.$content, 1.5, { scrollTo: { y: 0, autoKill: false }, ease: Power4.easeInOut } );
            }
        } );

        super.onStateChanged( newState, oldState );
    }

    onBeforeOpen () {
        const loadPosterActions = this.inlineVideoIds.map( videoId => loadInlineVideoPoster( videoId ) );

        if ( loadPosterActions.length ) {
            this.dispatch( batchActions( ...loadPosterActions ) );
        }
    }

    onBeforeVisible () {
        this.onResize();
    }

    onBeforeInvisible () {
        if ( this.inlineVideoIds.length ) {
            const stopActions = this.inlineVideoIds.map( videoId => togglePlayInlineVideo( videoId, false ) );
            const untouchActions = this.inlineVideoIds.map( videoId => setInlineVideoTouched( videoId, false ) );
            const actions = stopActions.concat( untouchActions );

            this.dispatch( batchActions( ...actions ) );
        }
    }

    close () {
        window.location.hash = '';
    }
}
