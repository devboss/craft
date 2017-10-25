#!/usr/bin/env node
const argv = require( 'minimist' )( process.argv.slice( 2 ) );

const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );
const workerFarm = require( 'worker-farm' );
const workers = workerFarm( require.resolve( './image-min-child-process-folder' ) );

const PROJECT_INPUT_PATH = argv._[ 0 ];
const PROJECT_OUTPUT_PATH = argv._[ 1 ];
const INPUT_PATH = path.join( process.cwd(), PROJECT_INPUT_PATH );
const OUTPUT_PATH = path.join( process.cwd(), PROJECT_OUTPUT_PATH );
const CACHE_PATH = path.join( INPUT_PATH, '_image-min-cache.json' );

const ignoreFiles = glob.sync( 'css-sprite-src/**/*', {
    cwd: INPUT_PATH
} );

const files = glob.sync( '**/*.{jpg,png}', {
    cwd: INPUT_PATH
} )
    .filter( filePath => ignoreFiles.indexOf( filePath ) === -1 );

let fileHash, outFileHash;

try {
    fileHash = require( CACHE_PATH );
}
catch ( err ) {
    fileHash = {};
}

outFileHash = {};

// group by directory to preserve folder structure
const dirs = files.reduce( ( acc, filePath ) => {
    const dir = path.dirname( path.join( OUTPUT_PATH, filePath ) );

    if ( !acc.hasOwnProperty( dir ) ) {
        acc[ dir ] = [];
    }

    acc[ dir ].push( filePath );

    return acc;
}, {} );

const dirNames = Object.keys( dirs );
let ret = 0;
let count = 0;

dirNames.forEach( dir => {
    workers( INPUT_PATH, dirs, dir, fileHash, ( e, processedFiles, outHash ) => {
        if ( e ) {
            console.error( e );
            return;
        }

        if ( processedFiles.length ) {
            const log = processedFiles.map( filePath => 'optimized ' + filePath ).join( '\n' );
            console.log( log );
        }

        outFileHash = Object.assign( outFileHash, outHash );

        count += processedFiles.length;

        if ( ++ret === dirNames.length ) {
            workerFarm.end( workers );

            deleteOldFiles();

            const sortedKeys = Object.keys( outFileHash ).sort();
            const sortedOutFileHash = sortedKeys.reduce( ( acc, keyName ) => {
                acc[ keyName ] = outFileHash[ keyName ];
                return acc;
            }, {} );

            fs.writeFileSync( CACHE_PATH, JSON.stringify( sortedOutFileHash, null, 2 ) );

            console.log( count + ' images optimized' );
        }
    } );
} );

function deleteOldFiles () {
    const inFiles = Object.keys( fileHash );
    const outFiles = Object.keys( outFileHash );

    const deleteFiles = inFiles.filter( file => {
        return !outFiles.includes( file );
    } )
        .map( file => ( {
            relative: path.join( PROJECT_OUTPUT_PATH, file ),
            absolute: path.join( OUTPUT_PATH, file )
        } ) );

    deleteFiles.forEach( file => {
        fs.unlink( file.absolute, err => {
            if ( err ) {
                console.error( err );
                return;
            }

            console.log( 'deleted ' + file.relative );
        } );
    } );
}
