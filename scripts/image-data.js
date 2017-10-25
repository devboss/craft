#!/usr/bin/env node
const argv = require( 'minimist' )( process.argv.slice( 2 ) );

const fs = require( 'fs' );
const path = require( 'path' );
const sizeOf = require( 'image-size' );

const inputFileRoot = 'resources/images-uncompressed';
const outputWebRoot = '/images';

const OUTPUT_FILE = path.join( process.cwd(), argv._.pop() );
const files = argv._;

const dataString = [ '$imageData: (' ];

const data = files.map( filename => {
    const dims = sizeOf( path.join( process.cwd(), filename ) );

    return Object.assign( dims, {
        name: filename.replace( inputFileRoot, outputWebRoot )
    } );
} );

const fileDataStrings = data.map( datum => {
    const str = [ '"' + datum.name + '" : (' ];
    str.push( 'width: ' + datum.width + ',' );
    str.push( 'height: ' + datum.height );
    str.push( ')' );

    return str.join( '\n' );
} );

dataString.push( fileDataStrings.join( ',\n' ) );
dataString.push( ');\n' );

console.log( 'writing data file to ' + OUTPUT_FILE );

fs.writeFileSync( OUTPUT_FILE, dataString.join( '\n' ) );
