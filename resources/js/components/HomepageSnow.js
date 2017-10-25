import AbstractComponent from './AbstractComponent';
import * as PIXI from 'pixi.js/dist/pixi';
import Actor from './Actor';
import { Vector3 } from '../utils/Vector3';
import { getRandomArbitrary, map, clamp } from '../utils/math';
import { compareState } from '../utils/stateHelpers';
import { setAnimationTimeout } from '../utils/setAnimationTimeout';
import SimplexNoise from 'simplex-noise';

export default class HomepageSnow extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.properties = {
            smallUp: {
                stageWidth: 1023,
                stageHeight: 939
            },
            largeUp: {
                stageWidth: 1094,
                stageHeight: 734
            }
        };

        this.currentProperties = null;

        this.numFlakes = 700;
        this.flakes = [];
        this.flakeData = [];
        this.gravityForce = new Vector3( 0, 0.01, 0 );
        this.windForce = new Vector3();
        this.isAnimating = false;

        this.noise = new SimplexNoise();

        this.app = new PIXI.Application( {
            transparent: true,
            resolution: window.devicePixelRatio || 1,
            width: this.stageWidth,
            height: this.stageHeight
        } );

        this.app.ticker.stop();
        this.app.ticker.add( this.onUpdate, this );

        this.stage = this.app.stage;

        this.mediaQueryManager.addListener( this.onBreakpointChanged, this );
        this.onBreakpointChanged();

        this.$element.append( this.app.view );
    }

    init () {
        this.setupFlakes();

        setTimeout( () => {
            this.startAnimation();
        }, 1200 );
    }

    startAnimation () {
        if ( this.isAnimating ) {
            return;
        }

        this.isAnimating = true;

        this.runningTime = 0;
        this.app.ticker.start();
    }

    stopAnimation () {
        if ( !this.isAnimating ) {
            return;
        }

        this.isAnimating = false;

        this.app.ticker.stop();
    }

    setupFlakes () {
        let sprite, actor, xRange, yRange, zValue, ySpeed;

        const props = this.currentProperties;

        for ( let i = 0, len = this.numFlakes; i < len; ++i ) {
            zValue = getRandomArbitrary( 1, 3 );
            xRange = props.stageWidth * zValue;
            yRange = props.stageHeight * zValue;
            ySpeed = getRandomArbitrary( 3, 4 );

            sprite = PIXI.Sprite.fromImage( '/images/backgrounds/homepage/snowflake.png' );
            actor = new Actor(
                new Vector3(
                    getRandomArbitrary( 0, xRange ),
                    getRandomArbitrary( -yRange, 0 ),
                    zValue
                ),
                getRandomArbitrary( 1, 2 ),
                0.9998
            );
            actor.velocity.y = ySpeed;

            // bit hacky, but add some expando properties to actor
            actor.defaultYSpeed = ySpeed;
            actor.inverseZ = 1 / zValue;

            this.stage.addChild( sprite );
            this.flakes.push( sprite );
            this.flakeData.push( actor );
        }
    }

    onUpdate ( delta ) {
        let actor, sprite;

        const noise = this.noise.noise2D( this.runningTime * 0.014, this.runningTime * 0.007 );
        const xForce = map( noise, -1, 1, -0.01, 0.01 );

        this.windForce.x += xForce;
        this.windForce.x = clamp( this.windForce.x, -0.04, 0.04 );

        for ( let i = 0, len = this.numFlakes; i < len; ++i ) {
            actor = this.flakeData[ i ];
            sprite = this.flakes[ i ];

            actor.applyForce( this.gravityForce );
            actor.applyForce( this.windForce );
            actor.update();

            this.wrapPosition( actor );
            this.applyPosition( sprite, actor );
        }

        this.runningTime += delta;
    }

    wrapPosition ( actor ) {
        const props = this.currentProperties;

        const position = actor.position;
        const tolerance = 10;
        const xRange = props.stageWidth * position.z;
        const yRange = props.stageHeight * position.z;

        if ( position.x < -tolerance ) {
            position.x = xRange + tolerance;
        }
        else if ( position.x > xRange + tolerance ) {
            position.x = -tolerance;
        }

        if ( position.y > yRange + tolerance ) {
            position.y = -tolerance;
            actor.velocity.y = actor.defaultYSpeed;
        }
    }

    applyPosition ( sprite, actor ) {
        const position = actor.position;
        const scale = actor.inverseZ;

        sprite.x = position.x * scale;
        sprite.y = position.y * scale;

        sprite.scale.x = scale;
        sprite.scale.y = scale;
    }

    onStateChanged ( newState, oldState ) {
        compareState( newState, oldState, [ 'books', 'currentBook' ], currentBook => {
            if ( currentBook === null ) {
                this.startAnimation();
                return;
            }

            setAnimationTimeout( () => {
                if ( this.isBookOpen() ) {
                    this.stopAnimation();
                }
            }, 2000 );
        } );
    }

    isBookOpen () {
        return this.stateGet( [ 'books', 'currentBook' ] ) !== null;
    }

    onBreakpointChanged () {
        this.currentProperties = this.mediaQueryManager.parseObjectWithMatches( this.properties );
        this.onResize();
    }

    onResize () {
        const props = this.currentProperties;

        this.width = Math.ceil( this.$element.outerWidth() );
        this.height = Math.ceil( this.$element.outerHeight() );

        const stageScale = this.width / props.stageWidth;
        this.stage.scale.x = this.stage.scale.y = stageScale;

        this.app.renderer.resize( this.width, this.height );
        this.app.view.style.width = this.width + 'px';
        this.app.view.style.height = this.height + 'px';
    }
}
