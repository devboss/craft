#!/usr/bin/env node
const argv = require( 'minimist' )( process.argv.slice( 2 ) );

const svgstore = require( 'svgstore' );
const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );

const INPUT_DIR = path.join( process.cwd(), argv._[ 0 ] );
const OUTPUT_PATH = path.join( process.cwd(), argv._[ 1 ] );

const files = glob.sync( path.join( INPUT_DIR, '*.svg' ) );
const sprites = svgstore();

files.forEach( file => {
    sprites.add( path.basename( file, '.svg' ), fs.readFileSync( file, 'utf8' ) );
} );

console.log( 'writing output to ' + OUTPUT_PATH );

fs.writeFileSync( OUTPUT_PATH, sprites );
