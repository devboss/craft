import AbstractComponent from './AbstractComponent';
import { compareState } from '../utils/stateHelpers';
import { getTransitionTimeForProperty } from '../utils/transitionHelpers';

export default class BurgerMenu extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.transitionTime = getTransitionTimeForProperty( this.$element, 'transform' );
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'mobileMenu', 'isOpen' ], isOpen => {
            if ( isOpen ) {
                this.$element.addClass( '-open' );

                setTimeout( () => {
                    this.$element.addClass( '-visible' );
                }, 100 );
            }
            else {
                this.$element.removeClass( '-visible' );

                setTimeout( () => {
                    this.$element.removeClass( '-open' );
                }, this.transitionTime );
            }
        } );
    }
}
