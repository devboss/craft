/**
 * Abstract State for the State Pattern
 */
export default class AbstractState {

    /**
     * @param {AbstractStateContextComponent} context
     */
    constructor ( context ) {
        /**
         * @protected
         * @type {AbstractStateContextComponent}
         */
        this.context = context;
    }

    onActivated () {
    }

    onStateChanged ( newState, oldState ) {
    }

    onResize () {
    }

    destroy () {
        this.context = null;
    }
}
