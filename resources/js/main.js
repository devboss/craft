import $ from 'jquery';
import 'EasePack';
import 'ScrollToPlugin';
import TweenLite from 'TweenLite';
import './lazySizesConfig';
import 'lazysizes';
import 'picturefill';
import './polyfills';

$.extend( $.fn, {
    findFirstDescendants: function ( selector ) {
        const $fromElement = this;

        // first find ALL descendants which match selector
        const $descendents = $fromElement.find( selector );

        // then filter by checking they are direct children of this element, using closest
        return $descendents.filter( function () {
            // closest begins with the element itself so select the parent first and limit search to this element context
            const $closest = $( this ).parent().closest( selector, $fromElement );
            return $closest[ 0 ] === $fromElement[ 0 ] || !$closest.length;
        } );
    }
} );

import svg4everybody from 'svg4everybody';

import classRegistry from './classRegistry';
import { compareState } from './utils/stateHelpers';
import detect from './utils/detect';
import detectPreserve3d from './utils/detectPreserve3d';

import AbstractComponent from './components/AbstractComponent';
import NavScroll from './components/NavScroll';
import LaplandSign from './components/LaplandSign';
import LinkDispatcher from './components/LinkDispatcher';
import BurgerMenu from './components/BurgerMenu';
import Camera from './components/Camera';
import PolaroidCarousel from './components/PolaroidCarousel';
import Overlay from './components/Overlay';
import BookOverlay from './components/BookOverlay';
import GalleryOverlay from './components/GalleryOverlay';
import Accordion from './components/Accordion';
import Book from './components/Book';
import OverlayVideo from './components/OverlayVideo';
import InlineVideo from './components/InlineVideo';
import Homepage from './components/Homepage';
import HomepageSnow from './components/HomepageSnow';
import DrawAnimation from './components/DrawAnimation';
import Loader from './components/Loader';
import CookieMessage from './components/CookieMessage';
import PremiumPlusHack from './components/PremiumPlusHack';
import MediaQueryManager from './MediaQueryManager';
import store from './reducers/store';
import breakpointRanges from './breakpointRanges';
import counter from './utils/counter';

import { setHash, setScrollPosition } from './actions/actions';
import { showBook, hideBook } from './actions/bookActions';
import { showLoader, hideLoader } from './actions/loaderActions';

class Application extends AbstractComponent {

    constructor ( $element ) {
        classRegistry.registerClass( 'NavScroll', NavScroll );
        classRegistry.registerClass( 'LaplandSign', LaplandSign );
        classRegistry.registerClass( 'LinkDispatcher', LinkDispatcher );
        classRegistry.registerClass( 'BurgerMenu', BurgerMenu );
        classRegistry.registerClass( 'Camera', Camera );
        classRegistry.registerClass( 'PolaroidCarousel', PolaroidCarousel );
        classRegistry.registerClass( 'Overlay', Overlay );
        classRegistry.registerClass( 'BookOverlay', BookOverlay );
        classRegistry.registerClass( 'GalleryOverlay', GalleryOverlay );
        classRegistry.registerClass( 'Accordion', Accordion );
        classRegistry.registerClass( 'Book', Book );
        classRegistry.registerClass( 'OverlayVideo', OverlayVideo );
        classRegistry.registerClass( 'InlineVideo', InlineVideo );
        classRegistry.registerClass( 'Homepage', Homepage );
        classRegistry.registerClass( 'HomepageSnow', HomepageSnow );
        classRegistry.registerClass( 'DrawAnimation', DrawAnimation );
        classRegistry.registerClass( 'Loader', Loader );
        classRegistry.registerClass( 'CookieMessage', CookieMessage );
        classRegistry.registerClass( 'PremiumPlusHack', PremiumPlusHack );

        const mediaQueryManager = new MediaQueryManager( breakpointRanges, false );

        mediaQueryManager.createQueriesFromDirections( [ 'Up' ] );

        super( $element, store, mediaQueryManager );

        this.initDetection();

        this.currentState = store.getState();

        store.subscribe( this.propagateStateChange.bind( this ) );
        this.storeRegistered();

        this.mediaQueryManager.addListener( this.onBreakpointChanged.bind( this ) );
        $( window ).on( 'resize', this.onResize.bind( this ) );

        this.onResize();
        this.init();

        svg4everybody();
    }

    initDetection () {
        detectPreserve3d();

        let className;

        if ( detect.os.phone ) {
            className = 'phone';
        }
        else if ( detect.os.tablet ) {
            className = 'tablet';
        }
        else {
            className = 'desktop';
        }

        if ( window.ie10 ) {
            className += ' ie10';
        }

        $( 'html' ).addClass( className );
    }

    init () {
        this.dispatch( showLoader() );
        this.initRouting();

        super.init();
    }

    onLoad () {
        this.$element.addClass( '-app-ready' );

        super.onLoad();

        this.dispatch( hideLoader() );
    }

    initRouting () {
        const dispatchHash = () => {
            this.dispatch( setHash( window.location.hash.substring( 1 ) ) );
        };

        $( window ).on( 'hashchange', dispatchHash );
        dispatchHash();
    }

    processHash ( hash, oldHash ) {
        const routes = [
            {
                regex: /^\/?$/,
                match: () => {
                    const currentBook = this.stateGet( [ 'books', 'currentBook' ] );
                    this.dispatch( hideBook( currentBook ) );
                }
            },
            {
                regex: /books\/([\w-]+)\/?(?:([\w-]+))?$/,
                match: ( bookName, pageName ) => {
                    this.dispatch( showBook( bookName, pageName ) );
                }
            }
        ];

        let test, route, params;

        for ( let i = 0, len = routes.length; i < len; ++i ) {
            route = routes[ i ];
            test = hash.match( route.regex );

            if ( test !== null ) {
                params = test.slice( 1 );
                route.match( ...params );

                break;
            }
        }
    }

    propagateStateChange () {
        const newState = this.getState();
        const oldState = this.currentState;

        this.currentState = newState;

        super.propagateStateChange( newState, oldState );
    }

    onStateChanged ( newState, oldState ) {
        // console.log( newState.toJS(), oldState.toJS() );
        compareState( newState, oldState, [ 'hash', 'value' ], this.processHash, this );
        compareState( newState, oldState, [ 'mobileMenu', 'isOpen' ], this.checkScrolling, this );
        compareState( newState, oldState, [ 'overlays' ], this.checkScrolling, this );

        compareState( newState, oldState, [ 'scrollPosition' ], scrollPosition => {
            const $targetElement = scrollPosition.get( '$targetElement' );
            const position = scrollPosition.get( 'position' );
            let targetPosition = false;

            if ( $targetElement !== null ) {
                targetPosition = $targetElement.offset().top;
            }
            else if ( position !== undefined ) {
                targetPosition = position;
            }

            if ( targetPosition !== false ) {
                TweenLite.to( window, 1.5, { scrollTo: { y: targetPosition, autoKill: false }, ease: Power4.easeInOut } );
            }

            // reset state
            this.dispatch( setScrollPosition( null ) );
        } );
    }

    onBreakpointChanged () {
        this.checkScrolling();
    }

    checkScrolling () {
        const isOverlayOpen = this.currentState.get( 'overlays' )
            .reduce( ( acc, overlay ) => {
                return acc || overlay.get( 'isOpen' );
            }, false );

        const isMenuOpen = this.currentState.getIn( [ 'mobileMenu', 'isOpen' ] ) ;
        const preventScrolling = isOverlayOpen || ( isMenuOpen && !this.mediaQueryManager.matches( 'largeUp' ) );

        this.$element.toggleClass( 'no-scroll', preventScrolling );
    }
}

const loadCounter = counter( 2, () => {
    window.app.onLoad();
} );

$( document ).ready( () => {
    window.app = new Application( $( 'body' ) );
    loadCounter();
} );

$( window ).on( 'load', loadCounter );
