import $ from 'jquery';
import classRegistry from '../classRegistry';

export default class AbstractComponent {

    constructor ( $element, store, mediaQueryManager ) {
        /**
         * @protected
         * @type {jQuery}
         */
        this.$element = $element;

        /**
         * @protected
         * @type {MediaQueryManager}
         */
        this.mediaQueryManager = mediaQueryManager;

        /**
         * @private
         * @type {Store}
         */
        this._store = store;

        /**
         * @private
         * @type {Array.<AbstractComponent>}
         */
        this.descendantComponents = [];

        this.instantiateDescendants();
    }

    storeRegistered () {
        // called after state change callback has been registered
        this.callDescendantsMethod( 'storeRegistered' );
    }

    init () {
        // called after initial onResize event fired and state change callback has been registered
        this.callDescendantsMethod( 'init' );
    }

    onLoad () {
        // called after window load event
        this.callDescendantsMethod( 'onLoad' );
    }

    dispatch ( action ) {
        this._store.dispatch( action );
    }

    /**
     * Do not override, this is useful to have as a separate function to onStateChanged to avoid forgetting to call super!
     * @param {Map} newState
     * @param {Map} oldState
     */
    propagateStateChange ( newState, oldState ) {
        if ( this.onStateChanged( newState, oldState ) !== false ) {
            this.callDescendantsMethod( 'propagateStateChange', newState, oldState );
        }
    }

    onStateChanged ( newState, oldState ) {
        // override in subclass
    }

    getStore () {
        return this._store;
    }

    getState () {
        return this._store.getState();
    }

    stateGet ( keyOrKeyPath, defaultValue = undefined ) {
        const method = Array.isArray( keyOrKeyPath ) ? 'getIn' : 'get';
        return this._store.getState()[ method ]( keyOrKeyPath, defaultValue );
    }

    instantiateDescendants ( $fromElement = this.$element ) {
        $fromElement.findFirstDescendants( '[data-class]' ).each( ( index, el ) => {
            this.instantiateDescendant( $( el ) );
        } );
    };

    instantiateDescendant ( $element ) {
        let classNames = $element.attr( 'data-class' ).split( ' ' );

        return classNames.map( classRef => {
            const ClassRef = classRegistry.getClass( classRef );
            return this.createComponentInstance( ClassRef, $element, false );
        } );
    }

    createComponentInstance ( ClassRef, $element = null ) {
        const instance = new ClassRef( $element, this._store, this.mediaQueryManager );

        this.descendantComponents.push( instance );

        return instance;
    }

    callDescendantsMethod ( methodName, ...args ) {
        this.descendantComponents.forEach( descendant => {
            descendant[ methodName ]( ...args );
        } );
    }

    findDescendantByClass ( ClassRef ) {
        const descendants = this.findDescendantsByClass( ClassRef );
        return descendants.length ? descendants[ 0 ] : null;
    }

    findDescendantsByClass ( ClassRef ) {
        return this.descendantComponents.filter( descedant => {
            return descedant instanceof ClassRef;
        } );
    }

    destroyDescendantComponents () {
        for ( let i = 0, len = this.descendantComponents.length; i < len; ++i ) {
            this.descendantComponents[ i ].destroy();
            this.descendantComponents[ i ] = null;
        }

        this.descendantComponents = null;
    }

    destroyDescendant ( instance ) {
        var index = this.descendantComponents.indexOf( instance );

        if ( index > -1 ) {
            this.descendantComponents.splice( index, 1 );
            instance.destroy();
        }
        else {
            throw new Error( 'Attempt to destroy unregistered descendant' );
        }
    }

    onResize () {
        this.callDescendantsMethod( 'onResize' );
    }

    destroy () {
        this.destroyDescendantComponents();

        this.$element = null;
        this._store = null;
        this.mediaQueryManager = null;
    }
}
