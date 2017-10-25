import $ from 'jquery';
import AbstractComponent from './AbstractComponent';
import { addAccordion, toggleAccordionIndex } from '../actions/actions';
import { compareState } from '../utils/stateHelpers';

export default class Accordion extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.name = this.$element.attr( 'data-name' );

        this.$items = this.$element.find( '.accordion__item' );
        this.$links = this.$element.find( '.accordion__link' );
        this.$arrows = this.$element.find( '.accordion__arrow' );
        this.$contents = this.$element.find( '.accordion__content' );
        this.$contentInners = this.$element.find( '.accordion__content-inner' );

        this.$links.on( 'click', this.onLinkClicked.bind( this ) );
        this.$arrows.on( 'click', this.onArrowClicked.bind( this ) );

        this.dispatch( addAccordion( this.name ) );

        setTimeout( () => {
            this.$element.addClass( '-accordion-ready' );
        }, 100 );
    }

    onLinkClicked ( e ) {
        this.dispatchIndex( this.$links.index( $( e.currentTarget ) ) );
    }

    onArrowClicked ( e ) {
        this.dispatchIndex( this.$arrows.index( $( e.currentTarget ) ) );
    }

    dispatchIndex ( index ) {
        this.dispatch( toggleAccordionIndex( this.name, index ) );
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'accordions', this.name, 'currentOpenIndex' ], ( newIndex, oldIndex ) => {
            if ( typeof newIndex === 'number' && newIndex > -1 ) {
                const height = this.$contentInners.eq( newIndex ).outerHeight();

                this.$items.eq( newIndex ).addClass( '-active' );
                this.$contents.eq( newIndex ).css( 'height', height );
            }

            if ( typeof oldIndex === 'number' && oldIndex > -1 ) {
                this.$items.eq( oldIndex ).removeClass( '-active' );
                this.$contents.eq( oldIndex ).css( 'height', 0 );
            }
        } );
    }

    onResize () {
        const currentIndex = this.stateGet( [ 'accordions', this.name, 'currentOpenIndex' ] );

        if ( typeof currentIndex === 'number' && currentIndex > -1 ) {
            const height = this.$contentInners.eq( currentIndex ).outerHeight();
            this.$contents.eq( currentIndex ).css( 'height', height );
        }
    }
}
