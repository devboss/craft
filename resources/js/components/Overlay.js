import $ from 'jquery';

import AbstractComponent from './AbstractComponent';
import { addOverlay, closeOverlay } from '../actions/actions';
import { compareState } from '../utils/stateHelpers';

export default class Overlay extends AbstractComponent {

    constructor ( $element, store, mediaQueryManager, overlayData = {} ) {
        super( $element, store, mediaQueryManager );

        this.transitionTime = 500;

        this.$background = this.$element.find( '.overlay__background' );
        this.$content = this.$element.find( '.overlay__content' );
        this.$close = this.$element.find( '.overlay__close' );

        this.name = this.$element.attr( 'data-name' );

        if ( this.name === undefined ) {
            throw new Error( 'Overlay requires data-name property!' );
        }

        this.$background.on( 'click', this.onBackgroundClicked.bind( this ) );
        this.$close.on( 'click', this.onCloseClicked.bind( this ) );

        // any elements that should stop a click close from firing should go here
        this.$activeElements = this.$close.length ? [ this.$close ] : [];

        this.dispatch( addOverlay( this.name, overlayData ) );
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'overlays' ], ( overlays, oldOverlays ) => {
            const isOpen = this.isOpen( overlays );
            const wasOpen = this.isOpen( oldOverlays );

            if ( isOpen !== wasOpen ) {
                this.onOverlayStateChanged( isOpen );
            }
        } );
    }

    onOverlayStateChanged ( isOpen ) {
        if ( isOpen ) {
            this.onBeforeOpen();
            this.$element.addClass( '-open' );

            setTimeout( () => {
                if ( !this.isOpen() ) {
                    return;
                }

                this.onBeforeVisible();
                this.$element.addClass( '-visible' );
            }, 100 );
        }
        else {
            this.onBeforeInvisible();
            this.$element.removeClass( '-visible' );

            setTimeout( () => {
                if ( this.isOpen() ) {
                    return;
                }

                this.onAfterInvisible();
                this.$element.removeClass( '-open' );
                this.onAfterClosed();
            }, this.transitionTime );
        }
    }

    onBeforeOpen () {
    }

    onBeforeVisible () {
    }

    onBeforeInvisible () {
    }

    onAfterInvisible () {
    }

    onAfterClosed () {
    }

    onBackgroundClicked ( e ) {
        const $target = $( e.target );

        // could use stopPropagation, but this is a convenient catch all method, especially for links with no JS
        const isClickProcessed =
            this.$activeElements.reduce( ( acc, $el ) => acc || $el.is( $target ) || $.contains( $el[ 0 ], $target[ 0 ] ), false );

        if ( isClickProcessed ) {
            return;
        }

        e.preventDefault();
        this.close();
    }

    onCloseClicked ( e ) {
        e.preventDefault();
        this.close();
    }

    close () {
        this.dispatch( closeOverlay( this.name ) );
    }

    isOpen ( overlays = this.stateGet( 'overlays' ) ) {
        const thisOverlay = overlays.find( overlay => overlay.get( 'name' ) === this.name );
        return thisOverlay && thisOverlay.get( 'isOpen' );
    }
}
