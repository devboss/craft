import $ from 'jquery';
import picturefill from 'picturefill';
import Overlay from './Overlay';
import Swiper from 'swiper';
import { compareState } from '../utils/stateHelpers';
import { setGalleryOverlaySlideIndex } from '../actions/actions';
import lazySizes from 'lazysizes';

export default class GalleryOverlay extends Overlay {

    constructor ( $element, store, mediaQueryManager ) {
        super( $element, store, mediaQueryManager, {
            slideIndex: 0
        } );

        this.baseFontSize = 100;

        this.$imgs = this.$element.find( '.gallery-overlay__image' );
        this.$firstSlide = this.$element.find( '.swiper-slide' );

        this.$imgs.on( 'load', this.onImageLoaded.bind( this ) );

        const $nextButton = this.$element.find( '.polaroid-carousel__button--gallery-overlay.-next' );
        const $prevButton = this.$element.find( '.polaroid-carousel__button--gallery-overlay.-previous' );

        this.swiper = new Swiper( this.$element.find( '.swiper-container' ), {
            speed: 400,
            setWrapperSize: true,
            slidesPerView: 1,
            simulateTouch: false,
            preventClicks: true,
            nextButton: $nextButton,
            prevButton: $prevButton,
            onSlideChangeStart: swiper => {
                this.dispatch( setGalleryOverlaySlideIndex( swiper.activeIndex ) );
            }
        } );

        this.$activeElements = this.$activeElements.concat( $nextButton, $prevButton, this.$imgs );
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, 'overlays', ( overlays, oldOverlays ) => {
            const slideIndex = overlays.find( overlay => overlay.get( 'name' ) === 'gallery' ).get( 'slideIndex' );
            const oldSlideIndex = oldOverlays.find( overlay => overlay.get( 'name' ) === 'gallery' ).get( 'slideIndex' );

            // lazySizes doesn't seem to account for translation in it's viewport, so manually load surrounding images
            [ slideIndex - 1, slideIndex, slideIndex + 1 ]
                .filter( index => index > -1 && index < this.$imgs.length )
                .map( index => this.$imgs.eq( index )[ 0 ] )
                .forEach( img => lazySizes.loader.unveil( img ) );

            if ( slideIndex !== oldSlideIndex && slideIndex !== this.swiper.activeIndex ) {
                const speed = this.isOpen( overlays ) ? 400 : 0;
                this.swiper.slideTo( slideIndex, speed );
            }
        } );

        super.onStateChanged( newState, oldState );
    }

    onBeforeVisible () {
        // this is necessary so swiper can reflow layout once component is visible but before it animates in
        this.swiper.update( true );
    }

    onImageLoaded ( e ) {
        const img = e.currentTarget;

        picturefill( {
            reevaluate: true,
            elements: [ img ]
        } );

        this.layoutImage( img );
    }

    onResize () {
        const windowWidth = window.innerWidth;
        const windowFactor = Math.min( windowWidth / 1440, 1 );
        const fontSize = this.baseFontSize * windowFactor;

        this.$element.css( 'fontSize', fontSize );

        const paddingHorizontal = parseInt( this.$firstSlide.css( 'paddingLeft' ) );
        const paddingVertical = parseInt( this.$firstSlide.css( 'paddingTop' ) );

        this.availableWidth = windowWidth - paddingHorizontal * 2;
        this.availableHeight = window.innerHeight - paddingVertical * 2;
        this.availableAspect = this.availableWidth / this.availableHeight;

        this.$imgs.each( ( index, el ) => {
            this.layoutImage( el );
        } );
    }

    layoutImage ( img ) {
        if ( !img.complete ) {
            return;
        }

        const $el = $( img );
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        const aspect = width / height;

        if ( this.availableAspect > aspect ) {
            height = this.availableHeight;
            width = Math.round( aspect * height );
        }
        else {
            width = this.availableWidth;
            height = Math.round( width / aspect );
        }

        $el.css( {
            width,
            height
        } );
    }
}
