import AbstractComponent from './AbstractComponent';
import throttle from 'throttle-debounce/throttle';

export default class LaplandSign extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.force = 0;

        this.raf = null;
        this.animating = false;

        this.r = 90;
        this.gravity = 0.4;
        this.aVelocity = 0.0;
        this.aImpulse = 0;
        this.aAcceleration = 0.0;
        this.damping = 0.98;
        this.angle = 0;

        this.$link = this.$element.find( '.lapland-sign__link' );

        this.$link.on( 'mouseover', throttle( 300, e => {
            // TODO: look into testing which side of the rectangle the mouse is on
            // http://stackoverflow.com/questions/35821611/find-a-point-inside-a-rotated-rectangle

            this.aImpulse = 0.02;
            this.startAnimation();
        } ) );
    }

    startAnimation () {
        if ( !this.animating ) {
            this.animating = true;
            this.raf = requestAnimationFrame( this.update.bind( this ) );
        }
    }

    calculateGravitationalForce ( angle ) {
        return ( -1 * this.gravity / this.r ) * Math.sin( angle );
    }

    update () {
        if ( this.animating ) {
            this.raf = requestAnimationFrame( this.update.bind( this ) );
        }

        this.aAcceleration = this.aImpulse + this.calculateGravitationalForce( this.angle );
        this.aVelocity += this.aAcceleration;
        this.angle += this.aVelocity;

        this.aImpulse = 0;

        const baseAngle = this.angle % Math.PI;
        const speed = Math.abs( this.aVelocity );

        if ( Math.abs( baseAngle ) < 0.00005 && speed < 0.00025 ) {
            this.stopAnimation();
        }

        this.aVelocity *= this.damping;

        this.$element.css( 'transform', `rotate(${ baseAngle }rad)` );
    }

    stopAnimation () {
        this.animating = false;

        if ( this.raf !== null ) {
            cancelAnimationFrame( this.raf );
            this.raf = null;
        }
    }
}
