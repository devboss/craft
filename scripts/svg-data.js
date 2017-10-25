#!/usr/bin/env node
const argv = require( 'minimist' )( process.argv.slice( 2 ) );

const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );
const phantom = require( 'phantom' );

const SVG_PATH = path.join( process.cwd(), argv._[ 0 ] );
const SASS_PATH = path.join( process.cwd(), argv._[ 1 ] );

const files = glob.sync( path.join( SVG_PATH, '*.svg' ) );
const fileData = [];

function getCounter ( numToLoad, cb ) {
    let numLoaded = 0;

    return function ( ...args ) {
        if ( ++numLoaded === numToLoad ) {
            cb( ...args );
        }
    };
}

const counter = getCounter( files.length, parsingComplete );

files.forEach( file => {
    const fileName = path.basename( file, '.svg' );
    const fileDatum = {
        name: fileName,
        viewBox: null,
        boundingBox: null
    };

    fs.readFile( file, ( err, data ) => {
        if ( err ) {
            throw err;
        }

        const svgString = data.toString();

        const re = /viewBox="(\d+\.?\d*) (\d+\.?\d*) (\d+\.?\d*) (\d+\.?\d*)"/i;
        const result = re.exec( svgString );

        if ( !result ) {
            console.warn( fileName + ' missing viewBox. Skipping file...' );
            counter();
            return;
        }

        let ph = null;

        fileDatum.viewBox = [ result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ] ];

        console.log( 'processing ' + file + '...' );

        // TODO: investigate opening single phantom instance and swapping out svg data
        phantom.create( [ '--local-to-remote-url-access=yes', '--web-security=false' ] )
            .then( instance => {
                console.log( 'creating phantom page for ' + fileName );

                ph = instance;
                return instance.createPage();
            } )
            .then( page => {
                page.property( 'content', `<html><body>${ svgString }</body></html>` )
                    .then( () => {
                        console.log( 'injecting javascript for ' + fileName );

                        return page.evaluate( function ( viewBoxStr ) {
                            var document = window.document;
                            var viewBox = JSON.parse( viewBoxStr );

                            var svg = document.querySelector( 'svg' );

                            // just make sure it's being rendered at the right size
                            svg.setAttribute( 'width', viewBox[ 2 ] );
                            svg.setAttribute( 'height', viewBox[ 3 ] );
                        
                            return svg.getBBox();
                        },
                            JSON.stringify( fileDatum.viewBox )
                        )
                            .then( bbox => {
                                console.log( 'reading data for ' + fileName );

                                fileDatum.boundingBox = bbox;
                                fileData.push( fileDatum );

                                ph.exit();

                                console.log( 'finished ' + fileName );

                                counter();
                            } )
                            .catch( err => phantomError( err, ph ) );
                    } )
                    .catch( err => phantomError( err, ph ) );
            } )
            .catch( err => phantomError( err, ph ) );
    } );
} );

function phantomError ( err, ph ) {
    console.error( err );

    if ( ph ) {
        ph.exit();
    }
}

function parsingComplete () {
    const svgData = [ '$svgData: (' ];

    fileData.sort( ( a, b ) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if ( nameA < nameB ) {
            return -1;
        }
        if ( nameA > nameB ) {
            return 1;
        }

        return 0;
    } );

    const fileDataStrings = fileData.map( fileDatum => {
        const centreX = fileDatum.boundingBox.width * 0.5 + fileDatum.boundingBox.x;
        const centreY = fileDatum.boundingBox.height * 0.5 + fileDatum.boundingBox.y;

        const str = [ fileDatum.name + ': (' ];
        str.push( 'view-box: (' + fileDatum.viewBox.join( ', ' ) + '),' );
        str.push( 'bounding-box: (' + fileDatum.boundingBox.x + ', ' + fileDatum.boundingBox.y + ', ' + fileDatum.boundingBox.width + ', ' + fileDatum.boundingBox.height + '),' );
        str.push( 'artwork-centre: (' + centreX + ', ' + centreY + ')' );
        str.push( ')' );

        return str.join( '\n' );
    } );

    svgData.push( fileDataStrings.join( ',\n' ) );
    svgData.push( ');' );

    console.log( 'writing data file to ' + SASS_PATH );

    fs.writeFileSync( SASS_PATH, svgData.join( '\n' ) );
}
