import Player from '@vimeo/player';
import AbstractComponent from './AbstractComponent';
import { addInlineVideo, setInlineVideoReady, togglePlayInlineVideo, setInlineVideoPosterLoaded } from '../actions/actions';
import { compareState } from '../utils/stateHelpers';
import lazySizes from 'lazysizes';

export default class InlineVideo extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.$video = this.$element.find( '.inline-video__video' );
        this.$play = this.$element.find( '.inline-video__play' );
        this.$poster = this.$element.find( '.inline-video__poster' );
        this.$poster.on( 'load', () => {
            this.dispatch( setInlineVideoPosterLoaded( this.id ) );
        } );

        this.id = this.$element.attr( 'data-id' );

        if ( this.id === 'undefined' ) {
            throw new Error( 'data-id is required' );
        }

        this.player = new Player( this.$video, {
            portrait: false,
            title: false,
            byline: false,
            id: this.id
        } );

        this.dispatch( addInlineVideo( this.id ) );

        this.player.on( 'play', () => {
            this.dispatch( togglePlayInlineVideo( this.id, true ) );
        } );

        this.player.on( 'pause', () => {
            this.dispatch( togglePlayInlineVideo( this.id, false ) );
        } );

        this.player.on( 'ended', () => {
            this.dispatch( togglePlayInlineVideo( this.id, false ) );
        } );

        this.player
            .ready()
            .then( () => {
                this.dispatch( setInlineVideoReady( this.id ) );
            } )
            .catch( error => {
                if ( window.console ) {
                    console.error( error );
                }
            } );

        this.$play.on( 'click', e => {
            e.preventDefault();
            const isPlaying = this.getVideoState( 'isPlaying' );
            this.dispatch( togglePlayInlineVideo( this.id, !isPlaying ) );
        } );
    }

    onStateChanged ( newState, oldState ) {
        const newVideo = newState.get( 'videos' ).find( video => video.get( 'id' ) === this.id );
        const oldVideo = oldState.get( 'videos' ).find( video => video.get( 'id' ) === this.id );

        compareState( newVideo, oldVideo, 'shouldLoadPoster', shouldLoadPoster => {
            if ( shouldLoadPoster && !newVideo.get( 'isPosterLoaded' ) ) {
                lazySizes.loader.unveil( this.$poster[ 0 ] );
            }
        } );

        compareState( newVideo, oldVideo, 'isPosterLoaded', isPosterLoaded => {
            this.$element.toggleClass( '-poster-loaded', isPosterLoaded );
        } );

        compareState( newVideo, oldVideo, 'isTouched', isTouched => {
            this.$element
                .toggleClass( '-video-touched', isTouched )
                .toggleClass( '-video-untouched', !isTouched );

            if ( !isTouched ) {
                this.player.setCurrentTime( 0 );
            }
        } );

        compareState( newVideo, oldVideo, 'isReady', isReady => {
            this.$element.toggleClass( '-video-ready', isReady );
        } );

        compareState( newVideo, oldVideo, 'isPlaying', isPlaying => {
            const method = isPlaying ? 'playerPlay' : 'playerPause';
            this[ method ]();
        } );
    }

    getVideoState ( keyOrKeyPath ) {
        const method = Array.isArray( keyOrKeyPath ) ? 'getIn' : 'get';

        return this.stateGet( 'videos' )
            .find( video => video.get( 'id' ) === this.id )[ method ]( keyOrKeyPath );
    }

    playerPlay () {
        this.getPlaying( isPlaying => {
            // we may get state changes from in or outside the vimeo API so make sure state matches up with player
            if ( !isPlaying ) {
                this.player.play();
            }

            this.$element
                .removeClass( '-video-ended' )
                .addClass( '-video-playing' );
        } );
    }

    playerPause () {
        this.getPlaying( ( isPlaying, hasEnded ) => {
            if ( isPlaying ) {
                this.player.pause();
            }

            if ( hasEnded ) {
                this.$element.addClass( '-video-ended' );
            }

            this.$element.removeClass( '-video-playing' );
        } );
    }

    getPlaying ( cb ) {
        Promise.all( [
            this.player.getPaused(),
            this.player.getEnded()
        ] )
            .then( res => {
                const isPaused = res.reduce( ( acc, state ) => acc || state, false );
                cb( !isPaused, res[ 1 ] );
            } );
    }
}
