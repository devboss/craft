import * as PIXI from 'pixi.js';
import TweenLite from 'TweenLite';
import lineIntersect from 'line-intersect';

import { Vector2 } from '../utils/Vector2';

export default class BrushStrokeMask {

    constructor ( stageWidth, stageHeight, angle, brushWidth, blur, pixelRatio, isWebGL ) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.angle = angle % 360;
        this.radAngle = angle * Math.PI / 180;

        this.brushWidth = brushWidth;
        this.halfBrushWidth = this.brushWidth * 0.5;

        this.isWebGL = isWebGL;

        /**
         * @private
         * @type {Array.<Vector2>}
         */
        this.paintLinePoints = [];
        this.paintLineLengths = [];
        this.paintLineLength = 0;
        this.drawnLinePerc = 0;

        this.line = new PIXI.Graphics();
        this.tween = null;

        if ( this.isWebGL ) {
            if ( blur > 0 ) {
                this.blurFilter = new PIXI.filters.BlurFilter();
                this.blurFilter.blur = blur;

                this.line.filters = [ this.blurFilter ];
            }

            this.stage = new PIXI.Container();
            this.stage.addChild( this.line );

            this.renderTexture = PIXI.RenderTexture.create( stageWidth, stageHeight, PIXI.SCALE_MODES.LINEAR, pixelRatio );

            this.mask = new PIXI.Sprite( this.renderTexture );
        }
        else {
            this.mask = this.line;
        }

        // for calculations
        this.d = new Vector2();

        this.setupPaintLines();
    }

    setupPaintLines () {
        const c = Math.cos( this.radAngle );
        const s = Math.sin( this.radAngle );

        const lineHeight = this.brushWidth;
        // make sure this is big enough to always be outside the rectangle
        const largeDimension = Math.max( this.stageWidth, this.stageHeight ) * 2;

        const cxStep = lineHeight * s;
        const cyStep = lineHeight * c;
        const lx = largeDimension * c;
        const ly = largeDimension * s;

        const leftLine = [
            new Vector2( -this.halfBrushWidth, -this.halfBrushWidth ),
            new Vector2( -this.halfBrushWidth, this.stageHeight + this.halfBrushWidth )
        ];
        const bottomLine = [
            new Vector2( -this.halfBrushWidth, this.stageHeight + this.halfBrushWidth ),
            new Vector2( this.stageWidth + this.halfBrushWidth, this.stageHeight + this.halfBrushWidth )
        ];
        const topLine = [
            new Vector2( -this.halfBrushWidth, -this.halfBrushWidth ),
            new Vector2( this.stageWidth + this.halfBrushWidth, -this.halfBrushWidth )
        ];
        const rightLine = [
            new Vector2( this.stageWidth + this.halfBrushWidth, -this.halfBrushWidth ),
            new Vector2( this.stageWidth + this.halfBrushWidth, this.stageHeight + this.halfBrushWidth )
        ];

        const lines = [ leftLine, bottomLine, rightLine, topLine ];
        const clampAngle = this.angle < 0 ? 360 + this.angle : this.angle;

        const lineIndex1 = Math.floor( clampAngle / 90 );
        const lineIndex2 = ( lineIndex1 + 1 ) % 4;
        // order here is on purpose
        const lineIndex3 = ( lineIndex1 + 3 ) % 4;
        const lineIndex4 = ( lineIndex1 + 2 ) % 4;

        const drawLength = Math.abs( this.stageHeight * c ) + Math.abs( this.stageWidth * s );
        const d = new Vector2();

        let numLines = Math.round( drawLength / lineHeight );

        // measuring angle from 0 accounts for sin / cos flipping of x and y coords
        // Math.abs is maybe unnecessary but allows for more intuitive calculations below
        let cxOffset = Math.abs( this.halfBrushWidth * s );
        let cyOffset = Math.abs( this.halfBrushWidth * c );
        let cx, cy;
        let i;
        let x1, y1, x2, y2;
        let result;
        let point1, point2, length;

        if ( lineIndex1 === 0 ) {
            cx = cxOffset;
            cy = cyOffset;
        }
        else if ( lineIndex1 === 1 ) {
            cx = cxOffset;
            cy = this.stageHeight - cyOffset;
        }
        else if ( lineIndex1 === 2 ) {
            cx = this.stageWidth - cxOffset;
            cy = this.stageHeight - cyOffset;
        }
        else if ( lineIndex1 === 3 ) {
            cx = this.stageWidth - cxOffset;
            cy = cyOffset;
        }

        function testLine ( x1, y1, x2, y2, line ) {
            return lineIntersect.checkIntersection( x1, y1, x2, y2, line[ 0 ].x, line[ 0 ].y, line[ 1 ].x, line[ 1 ].y );
        }

        for ( i = 0; i < numLines; ++i ) {
            x1 = cx - lx;
            x2 = cx + lx;
            y1 = cy + ly;
            y2 = cy - ly;

            result = testLine( x1, y1, x2, y2, lines[ lineIndex1 ] );

            if ( result.type !== 'intersecting' ) {
                result = testLine( x1, y1, x2, y2, lines[ lineIndex2 ] );
            }

            if ( result.type !== 'intersecting' ) {
                cx += cxStep;
                cy += cyStep;
                continue;
            }

            point1 = new Vector2( result.point.x, result.point.y );

            result = testLine( x1, y1, x2, y2, lines[ lineIndex3 ] );

            if ( result.type !== 'intersecting' ) {
                result = testLine( x1, y1, x2, y2, lines[ lineIndex4 ] );
            }

            if ( result.type !== 'intersecting' ) {
                cx += cxStep;
                cy += cyStep;
                continue;
            }

            point2 = new Vector2( result.point.x, result.point.y );

            this.paintLinePoints.push( point1 );
            this.paintLinePoints.push( point2 );

            cx += cxStep;
            cy += cyStep;
        }

        point1 = this.paintLinePoints[ 0 ];
        numLines = this.paintLinePoints.length - 1;

        // this.line.lineStyle( 1, 0xff0000 );
        // this.line.moveTo( point1.x, point1.y );

        for ( i = 0; i < numLines; ++i ) {
            point1 = this.paintLinePoints[ i ];
            point2 = this.paintLinePoints[ i + 1 ];

            // this.line.lineTo( point2.x, point2.y );

            length = d.subVectors( point2, point1 ).length();

            this.paintLineLengths.push( length );
            this.paintLineLength += length;
        }
    }

    animatePaintLine ( time, cb ) {
        this.tween = TweenLite.to( this, time, {
            drawnLinePerc: 1,
            onUpdate: this.drawPaintLine.bind( this ),
            onComplete: () => {
                this.tween = null;
                cb( null );
            },
            ease: Sine.easeIn
        } );
    }

    drawPaintLine () {
        const perc = this.drawnLinePerc;
        const drawnLineLength = this.paintLineLength * perc;
        const numStrokes = this.paintLineLengths.length;

        let i, strokeLength, alpha;
        let lineIndex = numStrokes;
        let usedLineLength = 0;
        let p1, p2;

        if ( perc < 1 ) {
            lineIndex = 0;

            for ( i = 0; i < numStrokes; ++i ) {
                strokeLength = this.paintLineLengths[ i ];

                if ( usedLineLength + strokeLength > drawnLineLength ) {
                    alpha = ( drawnLineLength - usedLineLength ) / strokeLength;
                    lineIndex = i;
                    break;
                }

                usedLineLength += strokeLength;
            }
        }

        p1 = this.paintLinePoints[ 0 ];

        // TODO: cache indices so we only draw new ones
        this.line.clear();
        this.line.lineStyle( this.brushWidth, 0xffffff );
        this.line.moveTo( p1.x, p1.y );

        for ( let i = 0; i < lineIndex; ++i ) {
            p2 = this.paintLinePoints[ i + 1 ];

            this.line.lineTo( p2.x, p2.y );
        }

        // const easeInOutQuart = function ( t, b, c, d ) {
        //     if ( ( t /= d / 2 ) < 1 ) return c / 2 * t * t * t * t + b;
        //     return -c / 2 * ( ( t -= 2 ) * t * t * t - 2 ) + b;
        // };
        //
        // const easeOutSine = function ( t, b, c, d ) {
        //     return c * Math.sin( t / d * ( Math.PI / 2 ) ) + b;
        // };

        const easeInOutSine = function ( t, b, c, d ) {
            return -c / 2 * ( Math.cos( Math.PI * t / d ) - 1 ) + b;
        };

        if ( perc < 1 ) {
            p1 = this.paintLinePoints[ lineIndex ];
            p2 = this.paintLinePoints[ lineIndex + 1 ];

            this.d.copy( p1 );
            this.d.lerp( p2, easeInOutSine( alpha, 0, 1, 1 ) );

            // not sure why this moveTo is necessary but it bugs out without it
            this.line.moveTo( p1.x, p1.y );
            this.line.lineTo( this.d.x, this.d.y );

            this.line.lineStyle( 0 );
            this.line.beginFill( 0xffffff );
            this.line.drawCircle( this.d.x, this.d.y, this.halfBrushWidth );
            this.line.endFill();
        }
    }

    render ( renderer ) {
        if ( this.isWebGL ) {
            renderer.render( this.stage, this.renderTexture );
        }
    }

    stopAnimation ( reset = false ) {
        if ( this.tween !== null ) {
            this.tween.kill();
            this.tween = null;
        }

        if ( reset ) {
            this.drawnLinePerc = 0;
            this.drawPaintLine();
        }
    }

    destroy () {
        this.paintLinePoints = null;
        this.paintLineLengths = null;

        this.d = null;

        if ( this.tween !== null ) {
            this.tween.kill();
        }

        this.tween = null;

        if ( this.isWebGL ) {
            this.blurFilter = null;
            this.line.filters = null;

            // destroys renderTexture too
            this.mask.destroy( {
                children: true,
                texture: true,
                baseTexture: true
            } );

            this.renderTexture = null;
            this.mask = null;

            this.stage.destroy( {
                children: true,
                texture: true,
                baseTexture: true
            } );

            this.stage = null;
        }
        else {
            this.mask = null;
        }

        this.line = null;
    }
}
