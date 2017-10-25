import AbstractComponent from './AbstractComponent';
import { setCookiesAccepted } from '../actions/actions';
import { compareState } from '../utils/stateHelpers';

export default class CookieMessage extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.$close = this.$element.find( '.cookie-message__close' );
        this.$close.on( 'click', e => {
            e.preventDefault();

            this.dispatch( setCookiesAccepted( true ) );
        } );
    }

    onLoad () {
        if ( !this.stateGet( [ 'cookies', 'accepted' ] ) ) {
            setTimeout( () => {
                this.onCookieMessageAcceptedChanged( false );
            }, 1000 );
        }
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'cookies', 'accepted' ], this.onCookieMessageAcceptedChanged, this );
    }

    onCookieMessageAcceptedChanged ( accepted ) {
        const isVisible = !accepted;

        if ( isVisible ) {
            this.$element.addClass( '-open' );

            setTimeout( () => {
                this.$element.addClass( '-visible' );
            }, 100 );
        }
        else {
            this.$element.removeClass( '-visible' );

            setTimeout( () => {
                this.$element.removeClass( '-open' );
            }, 600 );
        }
    }
}
