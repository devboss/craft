import $ from 'jquery';
import counter from '../utils/counter';
import picturefill from 'picturefill';

export function readImageSources ( $img ) {
    const $picture = $img.parent();
    const $source = $picture.children( 'source' );

    const $mobileSource = $source.filter( ( index, el ) => {
        // depending on whether lazySizes has updated this yet
        const media = [ '(max-width: 1023px)', '--medium' ];
        return media.includes( $( el ).attr( 'media' ) );
    } );

    if ( $source.length !== 2 ) {
        throw Error( 'Each page image should be inside a picture element with 2 sources' );
    }

    if ( !$mobileSource.length ) {
        throw Error( 'Expecting a source element with media set to (max-width: 1023px)' );
    }

    const $tabletSource = $source.not( $mobileSource );

    const mobile = getSourcesFromSource( $mobileSource );
    const tablet = getSourcesFromSource( $tabletSource );

    return {
        mobile,
        tablet
    };
}

export function getSourcesFromSource ( $source ) {
    let srcset = $source.attr( 'data-srcset' );
    let result;

    if ( srcset.indexOf( 'data:image' ) === 0 ) {
        result = [ {
            src: srcset
        } ];
    }
    else {
        result = srcset
            .split( ',' )
            .map( src => {
                const parts = src.trim().split( ' ' );

                return {
                    src: parts[ 0 ],
                    descriptor: parts[ 1 ]
                };
            } );
    }

    return result;
}

export function loadPagesImages ( pagesData, breakpoint, eachCb, allCb ) {
    const onPageLoad = counter(
        pagesData.size,
        eachCb,
        allCb
    );

    pagesData.forEach( pageData => {
        const imageData = pageData
            .get( 'images' )
            .map( image => image.get( breakpoint ) );

        const onImageLoad = counter(
            imageData.size,
            () => {
                onPageLoad( pageData.get( 'pageIndex' ) );
            }
        );

        imageData.forEach( data => {
            const loadData = data
                .filter( source => source.get( 'src' ).indexOf( 'data:image' ) === -1 );

            if ( !loadData.size ) {
                onImageLoad();
                return;
            }

            const $img = $( '<img sizes="100vw">' );
            $img.one( 'load', onImageLoad );

            const srcset = loadData
                .map( source => source.get( 'src' ) + ' ' + source.get( 'descriptor' ) )
                .join( ', ' );
            
            $img.attr( 'srcset', srcset );

            picturefill( {
                elements: [ $img[ 0 ] ]
            } );
        } );
    } );
}
