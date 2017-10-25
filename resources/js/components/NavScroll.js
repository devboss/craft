import AbstractComponent from './AbstractComponent';
import { compareState } from '../utils/stateHelpers';
import { setOpenScrollIndex } from '../actions/actions';
import detect from '../utils/detect';

export default class NavScroll extends AbstractComponent {

    constructor ( $element, store ) {
        super( $element, store );

        this.index = this.$element.index();

        this.$container = this.$element.find( '.nav-scroll__container' );
        this.$menu = this.$element.find( '.nav-scroll__menu' );

        this.minHeight = this.$container.outerHeight();
        this.maxHeight = 0;

        if ( detect.os.phone || detect.os.tablet ) {
            this.$element.on( 'touchend', () => {
                const openIndex = this.stateGet( [ 'navScrolls', 'openIndex' ] );

                if ( openIndex === this.index ) {
                    this.dispatch( setOpenScrollIndex( -1 ) );
                    return;
                }

                this.dispatch( setOpenScrollIndex( this.index ) );
            } );
        }
        else {
            this.$element.on( 'mouseover', () => {
                this.dispatch( setOpenScrollIndex( this.index ) );
            } );

            this.$element.on( 'mouseout', () => {
                this.dispatch( setOpenScrollIndex( -1 ) );
            } );
        }
    }

    isOpen () {
        return this.stateGet( [ 'navScrolls', 'openIndex' ] ) === this.index;
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'navScrolls', 'openIndex' ], ( openIndex, lastOpenIndex ) => {
            let targetHeight = false;

            if ( openIndex === this.index ) {
                targetHeight = this.maxHeight;
            }
            else if ( lastOpenIndex === this.index ) {
                targetHeight = this.minHeight;
            }

            if ( targetHeight !== false ) {
                this.$container.css( 'height', targetHeight );
            }
        } );
    }

    onResize () {
        this.maxHeight = this.$menu.outerHeight();

        if ( this.isOpen() ) {
            this.$container.css( 'height', this.maxHeight );
        }
    }
}
