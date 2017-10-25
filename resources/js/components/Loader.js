import * as PIXI from 'pixi.js';
import AbstractComponent from './AbstractComponent';
import { setAnimationTimeout } from '../utils/setAnimationTimeout';
import { compareState } from '../utils/stateHelpers';
import { setLoaderReady } from '../actions/loaderActions';

export default class Loader extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.stageWidth = 98;
        this.stageHeight = 98;
        this.pixelRatio = window.devicePixelRatio || 1;
        this.isVisible = false;
        this.showTimeout = null;
        this.hideTimeout = null;

        const loader = new PIXI.loaders.Loader();

        loader.add( 'loader', '/images/spritesheets/loader@2x.json' );
        loader.load( ( loader, resources ) => {
            const loaderFrames = Object.keys( resources.loader.data.frames )
                .map( frame => PIXI.Texture.fromFrame( frame ) );

            this.setupPixi( loaderFrames );
        } );
    }

    setupPixi ( loaderFrames ) {
        this.app = new PIXI.Application( {
            transparent: true,
            width: this.stageWidth,
            height: this.stageHeight,
            resolution: this.pixelRatio
        } );

        this.app.view.style.width = this.stageWidth + 'px';
        this.app.view.style.height = this.stageHeight + 'px';

        this.sprite = new PIXI.extras.AnimatedSprite( loaderFrames );
        this.sprite.animationSpeed = 1 / 6;
        this.sprite.loop = false;
        this.sprite.onComplete = () => {
            setAnimationTimeout( () => {
                this.sprite.gotoAndPlay( 0 );
            }, 500 );
        };

        this.app.stage.addChild( this.sprite );

        this.$element.append( this.app.view );

        this.app.ticker.stop();
        this.dispatch( setLoaderReady() );
    }

    onStateChanged ( newState, oldState ) {
        const newLoaderOverlay = newState.get( 'overlays' ).find( overlay => overlay.get( 'name' ) === 'loader' );
        const oldLoaderOverlay = oldState.get( 'overlays' ).find( overlay => overlay.get( 'name' ) === 'loader' );

        compareState( newState, oldState, [ 'loader', 'isReady' ], isReady => {
            if ( isReady && this.isOpen() ) {
                this.show();
            }
        } );

        compareState( newLoaderOverlay, oldLoaderOverlay, 'isOpen', isOpen => {
            if ( isOpen ) {
                this.show();
            }
            else {
                this.hide();
            }
        } );
    }

    isReady () {
        return this.stateGet( [ 'loader', 'isReady' ] );
    }

    isOpen () {
        const overlay = this.stateGet( 'overlays' ).find( overlay => overlay.get( 'name' ) === 'loader' );
        return overlay.get( 'isOpen' );
    }

    show () {
        // if we're already waiting for a showTimeout, don't call another
        if ( this.showTimeout !== null ) {
            return;
        }

        // don't want to show a loader if wait is less than 1 second
        this.showTimeout = setTimeout( () => {
            this.showTimeout = null;

            if ( !this.isOpen() || !this.isReady() ) {
                return;
            }

            this.app.ticker.start();
            this.sprite.gotoAndPlay( 0 );
            this.$element.addClass( '-visible' );
        }, 1000 );
    }

    hide () {
        if ( !this.isReady() || this.hideTimeout !== null ) {
            return;
        }

        this.$element.removeClass( '-visible' );

        this.hideTimeout = setTimeout( () => {
            this.hideTimeout = null;

            if ( this.isOpen() ) {
                return;
            }

            this.sprite.stop();
            this.app.ticker.stop();
        }, 300 );
    }
}
