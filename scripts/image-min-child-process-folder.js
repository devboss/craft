const hashFile = require( 'hash-file' );
const path = require( 'path' );
const imagemin = require( 'imagemin' );
const imageminPngquant = require( 'imagemin-pngquant' );
const imageminJpegRecompress = require( 'imagemin-jpeg-recompress' );

module.exports = ( INPUT_PATH, dirs, dir, fileHash, cb ) => {
    const filePaths = dirs[ dir ]
        .map( filePath => {
            return {
                absolute: path.join( INPUT_PATH, filePath ),
                relative: filePath
            };
        } );

    const outHash = filePaths.reduce( ( acc, filePath ) => {
        acc[ filePath.relative ] = hashFile.sync( filePath.absolute );
        return acc;
    }, {} );

    const files = filePaths
        .filter( filePath => {
            if ( !fileHash.hasOwnProperty( filePath.relative ) ) {
                return true;
            }

            return outHash[ filePath.relative ] !== fileHash[ filePath.relative ];
        } );

    const abs = files.map( filePath => filePath.absolute );
    const rel = files.map( filePath => filePath.relative );

    if ( !files.length ) {
        cb( null, rel, outHash );
        return;
    }

    imagemin( abs, dir, {
        use: [
            imageminJpegRecompress( {
                min: 10,
                max: 60
            } ),
            imageminPngquant( {
                quality: '50-80',
                speed: 1
            } )
        ]
    } )
        .then( () => {
            cb( null, rel, outHash );
        } )
        .catch( e => {
            cb( e );
        } );
};
