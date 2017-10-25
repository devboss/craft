import AbstractComponent from './AbstractComponent';
import actions from '../actions';

export default class LinkDispatcher extends AbstractComponent {

    constructor ( $element, store ) {
        super( $element, store );

        const actionName = this.$element.attr( 'data-action' );

        if ( !actionName ) {
            throw new Error( 'StateToggle component requires a data-action attribute' );
        }

        if ( !actions.hasOwnProperty( actionName ) ) {
            throw new Error( 'No action exists named: ' + actionName );
        }

        let args = this.$element.attr( 'data-action-args' );
        args = args ? args.split( '|' ) : [];

        const action = actions[ actionName ];

        this.$element.on( 'click', e => {
            e.preventDefault();
            this.dispatch( action( ...args ) );
        } );
    }
}
