#!/usr/bin/env node
const argv = require( 'minimist' )( process.argv.slice( 2 ) );
const sprity = require( 'sprity' );

const INPUT_PATH = argv._[ 0 ];
const OUTPUT_PATH = argv._[ 1 ];

const environment = require( './environment' );

const cssPath = environment.cssImagePath + '/css-sprite/';

sprity.create( {
    src: INPUT_PATH + '/*.png',
    out: OUTPUT_PATH,
    cssPath,
    cachebuster: true,
    style: '../../sass/settings/_sprity.scss',
    processor: 'sass',
    dimension: [ {
        ratio: 1,
        dpi: 72
    }, {
        ratio: 2,
        dpi: 192
    } ],
    orientation: 'binary-tree'
}, err => {
    if ( err ) {
        console.error( err );
        return;
    }

    console.log( 'sprite written successfully' );
} );

