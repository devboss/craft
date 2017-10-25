import AbstractBookState from './AbstractBookState';
import BookPageTablet from './BookPageTablet';
import { setBookPerspective } from '../actions/bookActions';
import { compareState } from '../utils/stateHelpers';
import counter from '../utils/counter';

export default class BookTablet extends AbstractBookState {

    constructor ( ...args ) {
        super( ...args );

        const $element = this.context.$element;

        this.spacing = 20;
        this.maxWidth = 1300;
        this.maxHeight = 823;
        this.basePerspective = 1440;
        this.aspect = this.maxWidth / this.maxHeight;

        // because IE10 and IE11 don't support preserve3d, we can't wrap the pages in a container element and transform
        // that, we have to transform the pages independently
        this.$frontPages = $element.find( '.page__side--front' );
        this.$backPages = $element.find( '.page__side--back' );

        if ( this.$frontPages.length !== this.$backPages.length + 1 ) {
            throw new Error( 'There must always be one more front page than back page for the book cover' );
        }

        const length = this.$frontPages.length;

        this.pages = this.$frontPages
            .map( i => {
                const frontZIndex = ( length - i ) * 10;
                const backZIndex = ( i + 1 ) * 10;

                return new BookPageTablet(
                    this.$frontPages.eq( i ),
                    this.$backPages.eq( i ),
                    i,
                    length,
                    frontZIndex,
                    backZIndex,
                    this.onPreviousClicked.bind( this ),
                    this.onNextClicked.bind( this ),
                    this.onCloseClicked.bind( this )
                );
            } )
            .get();
    }

    onActivated () {
        this.pages.forEach( page => page.onActivated() );
    }

    onPreviousClicked ( page ) {
        this.setPageByIndex( page.index - 1 );
    }

    onNextClicked ( page ) {
        this.setPageByIndex( page.index );
    }

    onCloseClicked () {
        this.close();
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'books', 'isTablet' ], this.onBookModeChanged, this );
        compareState( newState, oldState, [ 'books', this.name, 'currentPageIndex' ], this.onPageIndexChanged, this );
    }

    onBookModeChanged ( isTablet ) {
        if ( !isTablet ) {
            return;
        }

        const currentPageIndex = this.context.stateGet( [ 'books', this.name, 'currentPageIndex' ] );

        const pagesRight = this.pages
            .filter( ( page, index ) => index > currentPageIndex );

        const pagesLeft = this.pages
            .filter( ( page, index ) => index <= currentPageIndex );

        pagesRight.forEach( page => page.setTargetRotation( 0, 0 ) );
        pagesLeft.forEach( page => page.setTargetRotation( -180, 0 ) );
    }

    onPageIndexChanged ( nextPageIndex, lastPageIndex ) {
        const isOpening = lastPageIndex === -1;
        const isClosing = nextPageIndex === -1;
        const isOpeningOrClosing = isOpening || isClosing;
        const animateMultiple = Math.abs( nextPageIndex - lastPageIndex ) > 1;
        const speed = isClosing ? 160 : 120;
        const delayExtra = isOpening ? 0.3 : 0;
        const delayStep = isOpeningOrClosing ? 0.04 : 0.15;

        let distance, time, delay;
        let targetRotation = 0;

        this.applyPerspective();

        if ( !animateMultiple ) {
            let page;

            if ( nextPageIndex - lastPageIndex > 0 ) {
                // move next page left
                page = this.pages[ nextPageIndex ];
                targetRotation = -180;
            }
            else {
                // move last page right
                page = this.pages[ lastPageIndex ];
                targetRotation = 0;
            }

            distance = Math.abs( targetRotation - page.rotationY );
            time = distance / speed;

            page.setTargetRotation( targetRotation, time, delayExtra, this.clearPerspective.bind( this ) );

            return;
        }

        const animatePagesRight = this.pages
            .filter( ( page, index ) => index > nextPageIndex && page.rotationY < 0 );

        const animatePagesLeft = this.pages
            .filter( ( page, index ) => index <= nextPageIndex && page.rotationY > -180 );

        delay = ( animatePagesRight.length - 1 ) * delayStep + delayExtra;
        targetRotation = 0;

        const cb = counter( animatePagesRight.length + animatePagesLeft.length, this.clearPerspective.bind( this ) );

        animatePagesRight.forEach( page => {
            distance = Math.abs( targetRotation - page.rotationY );
            time = distance / speed;

            page.setTargetRotation( targetRotation, time, delay, cb );
            delay -= delayStep;
        } );

        delay = delayExtra;
        targetRotation = -180;

        animatePagesLeft.forEach( page => {
            distance = Math.abs( targetRotation - page.rotationY );
            time = distance / speed;

            page.setTargetRotation( targetRotation, time, delay, cb );
            delay += delayStep;
        } );
    }

    onResize () {
        const availableWidth = Math.min( window.innerWidth - this.spacing * 2, this.maxWidth );
        const availableHeight = Math.min( window.innerHeight - this.spacing * 2, this.maxHeight );
        const availableAspect = availableWidth / availableHeight;

        let width, height;

        if ( this.aspect > availableAspect ) {
            width = availableWidth;
            height = width / this.aspect;
        }
        else {
            height = availableHeight;
            width = this.aspect * height;
        }

        const scaleFactor = width / this.maxWidth;
        const perspective = this.basePerspective * scaleFactor;
        const css = {
            width: Math.round( width ),
            height: Math.round( height )
        };

        this.setPerspective( perspective );

        this.context.$element.css( css );

        super.onResize();
    }

    applyPerspective () {
        const perspective = this.context.stateGet( [ 'books', 'perspective' ] );

        this.context.$element.css( 'perspective', perspective );
    }

    clearPerspective () {
        const isAnimating = this.pages.reduce( ( acc, page ) => {
            return acc || page.isAnimating();
        }, false );

        if ( isAnimating ) {
            return;
        }

        this.context.$element.css( 'perspective', '' );
    }

    setPerspective ( perspective, obj = null ) {
        this.context.dispatch( setBookPerspective( perspective ) );

        if ( window.ie10 ) {
            this.pages.forEach( page => page.setPerspective( perspective ) );
        }
        else if ( obj !== null ) {
            obj.perspective = perspective;
        }
    }

    destroy () {
        const css = {
            width: '',
            height: ''
        };

        this.setPerspective( 'none', css );
        this.context.$element.css( css );

        this.$frontPages = null;
        this.$backPages = null;

        this.pages.forEach( page => page.destroy() );
        this.pages = null;

        super.destroy();
    }
}
