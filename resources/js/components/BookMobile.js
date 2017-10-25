import $ from 'jquery';
import AbstractBookState from './AbstractBookState';
import { compareState } from '../utils/stateHelpers';

export default class BookMobile extends AbstractBookState {

    constructor ( ...args ) {
        super( ...args );

        const $element = this.context.$element;

        this.$pages = $();
        this.$frontPages = $element.find( '.page__side--front' );
        this.$backPages = $element.find( '.page__side--back' );

        this.$previous = this.$frontPages.find( '.page__button--previous' );
        this.$next = this.$frontPages.find( '.page__button--next' );
        this.$close = this.$backPages.find( '.page__button--close' );
    }

    onActivated () {
        this.$previous.first().addClass( 'hide' );
        this.$next.last().addClass( 'hide' );

        this.$previous.on( 'click', e => {
            e.preventDefault();
            this.setPageByIndex( this.$previous.index( $( e.currentTarget ) ) - 1 );
        } );

        this.$next.on( 'click', e => {
            e.preventDefault();
            this.setPageByIndex( this.$next.index( $( e.currentTarget ) ) + 1 );
        } );

        this.$close.on( 'click', e => {
            e.preventDefault();
            this.close();
        } );
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'books', 'isTablet' ], isTablet => {
            if ( isTablet ) {
                return;
            }

            this.addContainers();
            this.getCurrentPage().addClass( '-open -visible' );
        } );

        compareState( newState, oldState, [ 'books', this.name, 'currentPageIndex' ], ( nextPageIndex, lastPageIndex ) => {
            if ( lastPageIndex > -1 ) {
                this.hidePage( this.$pages.eq( lastPageIndex ) );
            }

            if ( nextPageIndex > -1 ) {
                this.showPage( this.$pages.eq( nextPageIndex ) );
            }
        } );
    }

    showPage ( $page ) {
        $page.addClass( '-open' );

        setTimeout( () => {
            this.onResize();
            $page.addClass( '-visible' );
        }, 100 );
    }

    hidePage ( $page ) {
        $page.removeClass( '-visible' );

        setTimeout( () => {
            $page.removeClass( '-open' );
        }, 600 );
    }

    getCurrentPage () {
        const index = this.context.stateGet( [ 'books', this.name, 'currentPageIndex' ] );

        if ( index < 0 || index >= this.$pages.length ) {
            return $();
        }

        return this.$pages.eq( index );
    }

    addContainers () {
        /**
         * For 3D pages to work correctly cross-browser we can't have the page sides in a container, but for mobile, we
         * really need to have them in containers and stack them, so hacky solution to add and remove via JS.
         * The first front page is always the cover, so create double page spreads from everything else
         */
        this.$pages = this.$backPages.map( index => {
            const $el = $( '<div class="page"></div>' )
                .append( this.$backPages.eq( index ) )
                .append( this.$frontPages.eq( index + 1 ) );

            return $el[ 0 ];
        } );

        this.context.$element.append( this.$pages );
    }

    removeContainers () {
        this.$pages.detach();

        const $element = this.context.$element;

        this.$pages.each( index => {
            $element.append( this.$backPages.eq( index ) );
            $element.append( this.$frontPages.eq( index + 1 ) );
        } );
    }

    onResize () {
        const targetHeight = this.getCurrentPage().outerHeight();

        if ( targetHeight === undefined ) {
            return;
        }

        this.context.$element.css( 'height', targetHeight );
    }

    destroy () {
        this.context.$element.css( 'height', '' );

        this.$previous.off( 'click' );
        this.$next.off( 'click' );
        this.$close.off( 'click' );

        this.$previous.removeClass( 'hide' );
        this.$next.removeClass( 'hide' );

        this.$previous = null;
        this.$next = null;
        this.$close = null;

        this.removeContainers();
        this.getCurrentPage().removeClass( '-open -visible' );
        this.$pages = null;

        super.destroy();
    }
}
