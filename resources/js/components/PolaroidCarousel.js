import $ from 'jquery';

import AbstractComponent from './AbstractComponent';
import Swiper from 'swiper';
import { setGalleryActivePolaroidIndex, addGalleryPolaroids } from '../actions/actions';

export default class PolaroidCarousel extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.swiper = new Swiper( this.$element.find( '.polaroid-carousel__container' ), {
            speed: 400,
            setWrapperSize: true,
            slidesPerView: 4,
            slidesPerGroup: 4,
            simulateTouch: false,
            spaceBetween: 10,
            preventClicks: true,
            nextButton: this.$element.find( '.polaroid-carousel__button.-next' ),
            prevButton: this.$element.find( '.polaroid-carousel__button.-previous' ),
            breakpoints: {
                1023: {
                    slidesPerView: 3,
                    slidesPerGroup: 3
                }
            }
        } );

        this.$polaroids = this.$element.find( '.polaroid--slide' );
        this.$polaroids.on( 'click', e => {
            const index = this.$polaroids.index( $( e.currentTarget ) );

            this.dispatch( setGalleryActivePolaroidIndex( index ) );
        } );

        // hacky model set:
        const data = this.$element.find( '.polaroid__image' )
            .get()
            .map( el => {
                const $el = $( el );

                return {
                    caption: $el.attr( 'data-caption' ),
                    srcset: $el.attr( 'srcset' )
                };
            } );

        this.dispatch( addGalleryPolaroids( data ) );
    }
}
