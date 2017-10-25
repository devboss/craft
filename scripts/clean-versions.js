#!/usr/bin/env node
const glob = require( 'glob' );
const path = require( 'path' );
const fs = require( 'fs' );
const series = require( 'run-series' );
const PROJECT_ROOT = path.resolve( __dirname, '..' );
const PUBLIC_ROOT = path.join( PROJECT_ROOT, 'public' );
const manifestPath = path.join( PUBLIC_ROOT, 'mix-manifest.json' )
const manifest = require( manifestPath );

const cartAssistFiles = glob.sync( 'css/cart-assist-*.css', {
    cwd: PUBLIC_ROOT
} );

const cartAssistFilesMap = cartAssistFiles.map( fileName => {
    const destName = fileName.replace( /.[0-9a-z]+.css/, '.css' );
    const name = '/' + destName;
    const src = path.join( PUBLIC_ROOT, fileName );
    const dest = path.join( PUBLIC_ROOT, destName );

    return {
        name,
        src,
        dest
    };
} );

const cartAssistTasks = cartAssistFilesMap.map( data => {
    return ( cb ) => {
        fs.rename( data.src, data.dest, cb );
    };
} );

function renameFiles ( cb ) {
    series( cartAssistTasks, cb );
}

function rewriteManifest ( cb ) {
    const outputManifest = cartAssistFilesMap.reduce( ( acc, value ) => {
        acc[ value.name ] = value.name;
        return acc;
    }, manifest );

    fs.writeFile( manifestPath, JSON.stringify( outputManifest, null, 2 ), cb );
}

series( [ renameFiles, rewriteManifest ], ( err, results ) => {
    if ( err ) {
        console.error( err );
        return;
    }

    console.log( 'cart assist versions cleaned' );
} );
