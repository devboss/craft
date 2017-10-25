import AbstractComponent from './AbstractComponent';

/**
 * Abstract Context for the State Pattern
 */
export default class AbstractStateContextComponent extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.state = null;
    }

    setState ( state ) {
        if ( this.state !== null ) {
            this.state.destroy();
        }

        this.state = state;
        this.state.onActivated();
    }

    /**
     * Naming is confusing here, but onStateChanged refers to app data state, not this state pattern
     * @param newState
     * @param oldState
     */
    onStateChanged ( newState, oldState ) {
        if ( this.state !== null ) {
            this.state.onStateChanged( newState, oldState );
        }
    }

    onResize () {
        if ( this.state !== null ) {
            this.state.onResize();
        }

        super.onResize();
    }
}
