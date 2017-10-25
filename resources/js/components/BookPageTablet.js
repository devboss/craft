import TweenLite from 'TweenLite';

export default class BookPageTablet {

    constructor ( $pageFront, $pageBack, index, numPages, frontZIndex, backZIndex, onPreviousClicked, onNextClicked, onCloseClicked ) {
        this.$pageFront = $pageFront;
        this.$pageBack = $pageBack;

        this.index = index;
        this.numPages = numPages;
        this.frontZIndex = frontZIndex;
        this.backZIndex = backZIndex;

        this.isFrontVisible = true;
        this.isBackVisible = false;

        this.onPreviousClicked = onPreviousClicked;
        this.onNextClicked = onNextClicked;
        this.onCloseClicked = onCloseClicked;

        this.$pageFront.css( 'zIndex', this.frontZIndex );
        this.$pageBack.css( 'zIndex', this.backZIndex );

        this.name = this.$pageFront.attr( 'data-name' );

        this.startRotationY = 0;
        this.targetRotationY = 0;
        this.perspective = 0;
        this.rotationY = 0;
        this.zIndex = -1;
        this.currentTween = null;
    }

    onActivated () {
        // this functionality appears duplicated but it is slightly different as it applies to different button instances!
        this.$previous = this.$pageBack.find( '.page__button--previous' );
        this.$next = this.$pageFront.find( '.page__button--next' );
        this.$close = this.$pageFront.find( '.page__button--close' );

        const wrapCallback = ( cb ) => {
            return e => {
                e.preventDefault();

                if ( !this.isClickable() ) {
                    return;
                }

                cb( this );
            };
        };

        if ( this.index === 0 ) {
            this.$previous.addClass( 'hide' );
        }

        if ( this.index + 1 === this.numPages ) {
            this.$next.addClass( 'hide' );
        }

        this.$previous.on( 'click', wrapCallback( this.onPreviousClicked ) );
        this.$next.on( 'click', wrapCallback( this.onNextClicked ) );
        this.$close.on( 'click', wrapCallback( this.onCloseClicked ) );
    }

    setTargetRotation ( rotationY, time = 1, delay = 0, cb ) {
        if ( this.currentTween ) {
            this.currentTween.kill();
        }

        this.startRotationY = this.rotationY;
        this.targetRotationY = rotationY;

        /**
         * There's a subtle bug where if the time is zero, onComplete will fire before TweenLite.to returns, this means
         * that this.currentTween will NOT be null even though the tween has completed
         */
        if ( time === 0 ) {
            this.rotationY = this.targetRotationY;
            this.onUpdate( true );
            this.onComplete();
            return;
        }

        this.currentTween = TweenLite.to( this, time, {
            delay,
            rotationY,
            ease: Power4.easeInOut,
            onUpdate: this.onUpdate.bind( this ),
            onComplete: () => {
                this.onComplete();

                if ( cb ) {
                    cb();
                }
            }
        } );
    }

    onUpdate ( forceVisibility = false ) {
        if ( ( this.isFrontVisible || forceVisibility ) && this.rotationY <= -90 ) {
            this.isFrontVisible = false;
            this.isBackVisible = true;
            this.$pageFront.addClass( '-invisible' );
            this.$pageBack.removeClass( '-invisible' );
        }
        else if ( ( this.isBackVisible || forceVisibility ) && this.rotationY >= -90 ) {
            this.isBackVisible = false;
            this.isFrontVisible = true;
            this.$pageBack.addClass( '-invisible' );
            this.$pageFront.removeClass( '-invisible' );
        }

        let frontTransform = `rotateY(${ this.rotationY }deg)`;
        let backTransform = `translate3d(-100%, 0, 0) rotateY(${ this.rotationY + 180 }deg)`;

        // IE10 also has a glitch where backface visibility won't work if parent has perspective set, apply inline instead
        if ( window.ie10 ) {
            let perspective = this.perspective !== 'none' ? `perspective(${ this.perspective }px) ` : '';

            frontTransform = perspective + frontTransform;
            backTransform = perspective + backTransform;
        }

        this.$pageFront.css( 'transform', frontTransform );
        this.$pageBack.css( 'transform', backTransform );
    }

    clearTransforms () {
        this.$pageFront.css( 'transform', '' );
        this.$pageBack.css( 'transform', '' );
    }

    setPerspective ( perspective ) {
        this.perspective = perspective;
        this.onUpdate();
    }

    onComplete () {
        this.currentTween = null;
        this.startRotationY = this.rotationY;
    }

    isAnimating () {
        return this.currentTween !== null;
    }

    nearEnd () {
        const tolerance = 10;
        return Math.abs( this.targetRotationY - this.rotationY ) < tolerance;
    }

    isClickable () {
        return !this.isAnimating() || this.nearEnd();
    }

    destroy () {
        this.$pageFront.removeClass( '-invisible' ).css( 'zIndex', '' );
        this.$pageBack.removeClass( '-invisible' ).css( 'zIndex', '' );

        this.$previous.off( 'click' );
        this.$next.off( 'click' );
        this.$close.off( 'click' );
        this.$previous.removeClass( 'hide' );
        this.$next.removeClass( 'hide' );

        this.onPreviousClicked = null;
        this.onNextClicked = null;
        this.onCloseClicked = null;

        if ( this.currentTween !== null ) {
            this.currentTween.kill();
            this.currentTween = null;
        }

        this.clearTransforms();

        this.$pageFront = null;
        this.$pageBack = null;
        this.$previous = null;
        this.$next = null;
        this.$close = null;
    }
}
