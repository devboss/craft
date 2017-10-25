export function stringToKeyPath ( str, forceArray = true ) {
    if ( str.indexOf( '.' ) ) {
        return str.split( '.' );
    }

    return forceArray ? [ str ] : str;
}

export function attributeToKeyPath ( $element, attrName = 'data-key-path', forceArray = true ) {
    const str = $element.attr( attrName );

    if ( str === undefined ) {
        throw new Error( `element is missing ${ attrName } attribute` );
    }

    return stringToKeyPath( str, forceArray );
}
