import $ from 'jquery';
import picturefill from 'picturefill';

import AbstractComponent from './AbstractComponent';
import { compareState } from '../utils/stateHelpers';
import { setAnimationTimeout } from '../utils/setAnimationTimeout';
import detect from '../utils/detect';
import {
    batchActions,
    setScrollPosition,
    setGalleryActivePolaroidIndex,
    setGalleryScrollPolling,
    openOverlay,
    setGalleryOverlaySlideIndex
} from '../actions/actions';

export default class Camera extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.$button = this.$element.find( '.camera__button' );
        this.$cameraBodyContainer = this.$element.find( '.camera__body-container' );
        this.$polaroidContainer = this.$element.find( '.camera__polaroid-container' );

        this.polaroids = [];

        this.polaroidFontSizeFactor = 100 / 700;
        this.scrollTargetPosition = 0;

        const isDesktop = !( detect.os.phone || detect.os.tablet );
        const startEv = isDesktop ? 'mousedown' : 'touchstart';
        const endEv = isDesktop ? 'mouseup' : 'touchend';

        this.$button.on( startEv, e => {
            e.preventDefault();

            this.$button.addClass( '-active' );
        } );

        this.$button.on( endEv, e => {
            e.preventDefault();

            this.dispatch( setGalleryScrollPolling( false ) );
            this.dispatch( setScrollPosition( null, this.scrollTargetPosition ) );

            setAnimationTimeout( () => {
                this.dispatch( setGalleryActivePolaroidIndex( 0 ) );
            }, 450 );
        } );

        $( document ).on( endEv, () => {
            this.$button.removeClass( '-active' );
        } );

        this.$window = $( window );
        this.onScroll = this.onScroll.bind( this );
        this.enableScrollPolling();
    }

    enableScrollPolling () {
        this.$window.on( 'scroll', this.onScroll );
    }

    disableScrollPolling () {
        this.$window.off( 'scroll', this.onScroll );
    }

    onScroll () {
        if ( window.pageYOffset > this.scrollTriggerPosition ) {
            this.dispatch( setGalleryActivePolaroidIndex( 0 ) );
        }
    }

    // TODO: figure out where single source of truth for image data comes from!
    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'gallery', 'scrollPolling' ], scrollPolling => {
            const method = scrollPolling ? 'enableScrollPolling' : 'disableScrollPolling';
            this[ method ]();
        } );

        compareState( newState, oldState, [ 'gallery', 'activePolaroidIndex' ], activeIndex => {
            const polaroidState = this.stateGet( [ 'gallery', 'polaroids', activeIndex ] );

            if ( !polaroidState ) {
                return;
            }

            this.showPolaroid( polaroidState, activeIndex );
        } );
    }

    // TODO: is it worth having a Polaroid component?
    getPolaroid ( text, srcset ) {
        const $polaroid = $( `<div class="polaroid -in-camera">
            <div class="polaroid__image-container">
                <img class="polaroid__image" sizes="(max-width: 639px) 72vw, 49vw">
                <a class="polaroid__expand-button"></a>
            </div>
            <span class="polaroid__text">${ text }</span>
        </div>` );

        const $img = $polaroid.find( '.polaroid__image' );

        $img.one( 'load', e => {
            $( e.currentTarget ).addClass( '-loaded' );
        } );

        $img.attr( 'srcset', srcset );

        picturefill( {
            elements: [ $img[ 0 ] ]
        } );

        return $polaroid;
    }

    showPolaroid ( polaroidState, index ) {
        const dropShadowClass = !this.polaroids.length ? '-drop-shadow' : '-small-drop-shadow';

        const $nextPolaroid = this.getPolaroid( polaroidState.get( 'caption' ), polaroidState.get( 'srcset' ) )
            .addClass( dropShadowClass );

        $nextPolaroid
            .find( '.polaroid__expand-button' )
            .on( 'click', e => {
                e.preventDefault();
                this.dispatch( batchActions(
                    setGalleryOverlaySlideIndex( index ),
                    openOverlay( 'gallery' )
                ) );
            } );

        this.polaroids.push( $nextPolaroid );
        this.$polaroidContainer.append( $nextPolaroid );

        setTimeout( () => {
            $nextPolaroid
                .on( 'transitionend', this.onTransitionEnd.bind( this ) )
                .addClass( '-visible' );
        }, 100 );
    }

    onTransitionEnd ( e ) {
        const $polaroid = $( e.currentTarget );
        const polaroidIndex = this.polaroids.findIndex( $el => $el[ 0 ] === $polaroid[ 0 ] );
        const lastPolaroidIndex = polaroidIndex - 1;

        $polaroid.off( 'transitionend' );

        if ( lastPolaroidIndex > 0 ) {
            const $lastPolaroid = this.polaroids[ lastPolaroidIndex ];
            $lastPolaroid.remove();

            this.polaroids.splice( lastPolaroidIndex, 1 );
        }
    }

    onResize () {
        const cameraBodyContainerHeight = this.$cameraBodyContainer.outerHeight();

        this.scrollTriggerPosition = cameraBodyContainerHeight * 0.2;
        this.scrollTargetPosition = cameraBodyContainerHeight * 0.6;

        const polaroidContainerWidth = this.$polaroidContainer.outerWidth();
        const fontSize = polaroidContainerWidth * this.polaroidFontSizeFactor;

        this.$polaroidContainer.css( 'fontSize', fontSize );
    }
}
