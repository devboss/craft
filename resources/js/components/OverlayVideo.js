import Player from '@vimeo/player';

import AbstractComponent from './AbstractComponent';
import { compareState } from '../utils/stateHelpers';

export default class OverlayVideo extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.player = null;
    }

    onStateChanged ( newState, oldState ) {
        const videoIndex = newState.get( 'overlays' ).findIndex( overlay => overlay.get( 'name' ) === 'video' );

        const idChanged = compareState( newState, oldState, [ 'overlays', videoIndex, 'vimeoId' ], this.updatePlayer, this );

        compareState( newState, oldState, [ 'overlays', videoIndex, 'isOpen' ], isOpen => {
            if ( isOpen && !idChanged ) {
                this.playerPlay();
            }
            else if ( !isOpen ) {
                this.playerPause();
            }
        } );
    }

    updatePlayer ( id ) {
        if ( this.player === null ) {
            this.player = new Player( this.$element, {
                portrait: false,
                title: false,
                byline: false,
                id
            } );

            this.player
                .ready()
                .then( this.playerPlay.bind( this ) )
                .catch( this.videoError.bind( this ) );

            return;
        }

        this.player
            .loadVideo( id )
            .then( this.playerPlay.bind( this ) )
            .catch( this.videoError.bind( this ) );
    }

    playerPlay () {
        this.player.play();
        this.$element.addClass( '-video-ready' );
    }

    playerPause () {
        this.$element.removeClass( '-video-ready' );
        this.player.pause();
    }

    videoError ( error ) {
        if ( window.console ) {
            console.error( error );
        }
    }
}
