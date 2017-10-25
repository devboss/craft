import * as PIXI from 'pixi.js';

import AbstractComponent from './AbstractComponent';
import BrushStrokeMask from './BrushStrokeMask';
import series from 'run-series';
import { compareState } from '../utils/stateHelpers';
import { setAnimationTimeout } from '../utils/setAnimationTimeout';
import drawData from '../drawInData.json';

export default class DrawAnimation extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        // bit hacky, would be good to be passed it somehow
        this.bookName = this.$element.closest( '.book' ).attr( 'data-name' );
        this.animationName = this.$element.attr( 'data-name' );

        this.fileTypes = this.$element.attr( 'data-file-types' );
        this.fileTypes = this.fileTypes !== undefined ? this.fileTypes.split( '|' ) : [ 'line', 'colour' ];

        const animData = drawData[ this.animationName ] || {};

        this.fileTypeData = Object.assign( {}, drawData.default, animData );

        this.spriteTypes = {};
        this.brushTypes = {};

        this.width = 0;
        this.height = 0;
        this.stageWidth = 0;
        this.stageHeight = 0;

        this.app = null;
        this.stage = null;
        this.isWebGL = false;

        // TODO: pass more state to redux
        this.isActive = false;
        this.isInitialised = false;
        this.isAnimating = false;
        this.isComplete = false;
        this.isLarge = this.mediaQueryManager.matches( 'largeUp' );

        this.mediaQueryManager.addListener( this.onBreakpointChanged, this );
    }

    loadImages ( cb ) {
        const pixelRatio = window.devicePixelRatio || 1;
        const suffix = pixelRatio > 1 ? '@2x' : '';
        const namePrefix = this.animationName + '-';

        const files = this.fileTypes
            .map( name => namePrefix + name );

        const loader = new PIXI.loaders.Loader();

        files.forEach( file => {
            const src = `/images/static/books/animations/${ file }${ suffix }.png`;
            loader.add( file, src );
        } );

        loader.load( ( loader, resources ) => {
            // width / height returns the correct CSS pixel size based on the suffix @2x being present or not
            // http://pixijs.download/dev/docs/PIXI.Texture.html#.fromLoader
            Object.keys( resources ).forEach( resourceName => {
                const texture = resources[ resourceName ].texture;
                const typeName = resourceName.substring( namePrefix.length );

                if ( this.stageWidth === 0 ) {
                    this.stageWidth = texture.width;
                    this.stageHeight = texture.height;
                }

                this.spriteTypes[ typeName ] = new PIXI.Sprite( texture );
            } );

            this.setupPixi( pixelRatio, cb );
        } );
    }

    setupPixi ( pixelRatio, cb ) {
        this.app = new PIXI.Application( {
            transparent: true,
            resolution: pixelRatio,
            width: this.stageWidth,
            height: this.stageHeight
        } );

        this.app.ticker.stop();
        this.app.ticker.add( this.onUpdate, this );

        this.isWebGL = this.app.renderer instanceof PIXI.WebGLRenderer;

        this.stage = this.app.stage;

        this.fileTypes.forEach( type => {
            const sprite = this.spriteTypes[ type ];
            const data = this.fileTypeData[ type ];

            this.stage.addChildAt( sprite, 0 );

            if ( this.isWebGL ) {
                const brushStroke = new BrushStrokeMask( this.stageWidth, this.stageHeight, data.angle, data.brushWidth, data.blur, pixelRatio, this.isWebGL );
                this.brushTypes[ type ] = brushStroke;

                sprite.addChild( brushStroke.mask );
                sprite.mask = brushStroke.mask;
            }
        } );

        this.$element.append( this.app.view );

        this.isInitialised = true;

        this.onResize();

        cb();
    }

    startAnimation () {
        if ( this.isAnimating || !this.isWebGL ) {
            return;
        }

        this.isAnimating = true;
        this.isComplete = false;

        this.app.ticker.start();

        const animations = this.fileTypes.map( type => {
            const brushType = this.brushTypes[ type ];
            const time = this.fileTypeData[ type ].time;

            return cb => {
                brushType.animatePaintLine( time, cb );
            };
        } );

        series( animations, () => {
            this.isAnimating = false;
            this.isComplete = true;
        } );
    }

    stopAnimation () {
        // we still want to allow calling stopAnimation to reset everything after it's complete
        if ( !this.isAnimating && !this.isComplete ) {
            return;
        }

        this.isAnimating = false;

        this.app.ticker.stop();

        this.fileTypes.forEach( type => {
            this.brushTypes[ type ].stopAnimation( true );
        } );

        this.onUpdate();
        this.app.render();
    }

    onUpdate () {
        this.fileTypes.forEach( type => {
            this.brushTypes[ type ].render( this.app.renderer );
        } );
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'books', this.bookName, 'currentPageIndex' ], ( pageIndex, lastPageIndex ) => {
            const newPage = newState
                .getIn( [ 'books', this.bookName, 'pages' ] )
                .find( page => page.get( 'pageIndex' ) === pageIndex );

            const oldPage = newState
                .getIn( [ 'books', this.bookName, 'pages' ] )
                .find( page => page.get( 'pageIndex' ) === lastPageIndex );

            const pageAnimations = newPage.get( 'animations' );
            const lastPageAnimations = oldPage.get( 'animations' );

            if ( pageAnimations.includes( this.animationName ) ) {
                this.activate();
            }
            else if ( lastPageAnimations.includes( this.animationName ) ) {
                // TODO: this could be improved by storing page visibility in the store then we can start and stop
                // animations when they actually become visible
                this.deactivate();
            }
        } );
    }

    activate () {
        if ( this.isActive ) {
            return;
        }

        this.isActive = true;

        if ( !this.isLarge ) {
            return;
        }

        this.start();
    }

    start ( hasBreakpointChanged = false ) {
        const requestStartTime = performance.now();

        const doStart = () => {
            const time = performance.now() - requestStartTime;
            const waitTime = hasBreakpointChanged ? 0 : Math.max( 1200 - time, 0 );

            setAnimationTimeout( () => {
                if ( !this.isActive || !this.isLarge ) {
                    return;
                }

                this.startAnimation();
            }, waitTime );
        };

        if ( !this.isInitialised ) {
            this.loadImages( doStart );
            return;
        }

        doStart();
    }

    deactivate () {
        if ( !this.isActive ) {
            return;
        }

        this.isActive = false;

        // if we're changing breakpoints we want to stop animation immediately, otherwise wait 1000ms
        const waitTime = this.isLarge ? 1000 : 0;

        setAnimationTimeout( () => {
            // check we're still deactivating
            if ( this.isActive ) {
                return;
            }

            this.stopAnimation();
        }, waitTime );
    }

    onBreakpointChanged () {
        this.isLarge = this.mediaQueryManager.matches( 'largeUp' );

        if ( this.isLarge && this.isActive ) {
            this.start( true );
        }
        else {
            this.deactivate();
        }
    }

    onResize () {
        if ( !this.isInitialised ) {
            return;
        }

        this.width = Math.round( this.$element.outerWidth() );
        this.height = Math.round( this.$element.outerHeight() );

        const stageScale = this.width / this.stageWidth;
        this.stage.scale.x = this.stage.scale.y = stageScale;

        this.app.renderer.resize( this.width, this.height );
        this.app.view.style.width = this.width + 'px';
        this.app.view.style.height = this.height + 'px';

        if ( !this.isWebGL ) {
            this.app.render();
        }
    }

    destroy () {
        this.fileTypes.forEach( type => {
            if ( !this.brushTypes[ type ] ) {
                return;
            }

            this.brushTypes[ type ].destroy();
            this.brushTypes[ type ] = null;
        } );

        this.brushTypes = null;
        this.spriteTypes = null;

        this.stage.destroy( {
            children: true,
            texture: true,
            baseTexture: true
        } );

        this.app.destroy( true );

        this.app = null;
        this.stage = null;
    }
}
