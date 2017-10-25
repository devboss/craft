export function isStringNumber ( value ) {
    return !!( typeof value === 'string' && value.length && Number.isFinite( Number( value ) ) );
}

export function isStringBoolean ( value ) {
    const val = value.toLowerCase();
    return val === 'true' || val === 'false';
}

export function ucfirst ( str ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: ucfirst('kevin van zonneveld');
    // *     returns 1: 'Kevin van zonneveld'
    str += '';
    var f = str.charAt( 0 ).toUpperCase();
    return f + str.substr( 1 );
}

export function ucwords ( string ) {
    return ( string + '' ).replace( /^([a-z])|\s+([a-z])/g, function ( $1 ) {
        return $1.toUpperCase();
    } );
}

export function explodeCase ( string ) {
    return string.match( /[a-zA-Z][^A-Z]*/g );
}

export function camelCase ( string ) {
    string = this.ucwords( string ).replace( /\s/g, '' );
    return string.substring( 0, 1 ).toLowerCase() + string.slice( 1 );
}

export function unCamelCase ( string ) {
    return string
    // insert a space between lower & upper
        .replace( /([a-z])([A-Z])/g, '$1 $2' )
        // space before last upper in a sequence followed by lower
        .replace( /\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3' )
        // uppercase the first character
        .replace( /^./, function ( str ) {
            return str.toUpperCase();
        } );
}

export function camelCaseToSeo ( string ) {
    return this.seoText( this.unCamelCase( string ) );
}

export function seoToCamelCase ( string ) {
    return this.camelCase( this.unSeoText( string ) );
}

export function seoText ( string ) {
    string = string.toLowerCase( string.trim() );
    string = string.replace( /\./g, '' );
    string = string.replace( /[^a-z0-9-]/g, '-' );
    return string.replace( /-+/g, '-' );
}

export function unSeoText ( string ) {
    return string.replace( /-/g, ' ' );
}

export function truncateText ( string, charCount, suffix = '…' ) {
    if ( string.length < charCount ) {
        return string;
    }

    const str1 = string.substring( 0, charCount );
    const str2 = string.substring( charCount );

    if ( str2.substring( 0, 1 ).match( /\s/ ) ) {
        return str1 + suffix;
    }
    else {
        return str1.substring( 0, str1.lastIndexOf( ' ' ) ) + suffix;
    }
}
