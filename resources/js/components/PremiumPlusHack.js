import AbstractComponent from './AbstractComponent';

export default class PremiumPlusHack extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.$page = this.$element.find( '.blueprint__premium-plus-page' );
    }

    onResize () {
        const outerHeight = Math.round( this.$page.outerHeight() );
        this.$element.css( 'height', outerHeight );
    }
}
