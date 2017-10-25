#!/usr/bin/env node
const argv = require( 'minimist' )( process.argv.slice( 2 ) );

const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );
const SVGO = require( 'svgo' );

const removeHiddenElements = require( 'svgo/plugins/removeHiddenElems');
removeHiddenElements.params.displayNone = false;

const svgo = new SVGO( {
    plugins: [
        removeHiddenElements
    ]
} );

const INPUT_PATH = path.join( process.cwd(), argv._[ 0 ] );
const OUTPUT_PATH = path.join( process.cwd(), argv._[ 1 ] );

const ignoreFiles = [].map( fileName => path.join( INPUT_PATH, fileName ) );

const files = glob.sync( path.join( INPUT_PATH, '*.svg' ) )
    .filter( filePath => ignoreFiles.indexOf( filePath ) === -1 );

function getOutputFilePath ( filePath ) {
    return path.join( OUTPUT_PATH, path.basename( filePath ) );
}

files.forEach( filePath => {
    console.log( 'reading ' + filePath );

    fs.readFile( filePath, 'utf8', ( err, data ) => {
        if ( err ) {
            throw err;
        }

        console.log( 'optimizing ' + filePath );

        svgo.optimize( data, result => {
            const outputFilePath = getOutputFilePath( filePath );

            fs.writeFile( outputFilePath, result.data, 'utf8', err => {
                if ( err ) {
                    throw err;
                }

                console.log( 'written ' + outputFilePath );
            } );
        } );
    } );
} );

ignoreFiles.forEach( filePath => {
    const outputFilePath = getOutputFilePath( filePath );
    console.log( 'copying ' + filePath + ' to ' + outputFilePath );

    fs.createReadStream( filePath )
        .pipe( fs.createWriteStream( outputFilePath ) );
} );
