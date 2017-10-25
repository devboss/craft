import { is, isImmutable } from 'immutable';

function isEqual ( newValue, oldValue ) {
    return ( isImmutable( newValue ) && is( newValue, oldValue ) ) || newValue === oldValue;
}

export function compareState ( newState, oldState, keyOrKeyPath, callback, scope = window ) {
    const method = Array.isArray( keyOrKeyPath ) ? 'getIn' : 'get';
    const newValue = newState[ method ]( keyOrKeyPath );
    const oldValue = oldState[ method ]( keyOrKeyPath );

    if ( !isEqual( newValue, oldValue ) ) {
        callback.call( scope, newValue, oldValue );

        return true;
    }

    return false;
}

export function compareStateMultiple ( newState, oldState, keysOrKeyPaths, callback, scope = window ) {
    const newValues = [];
    const oldValues = [];
    let changed = false;

    keysOrKeyPaths.forEach( keyPath => {
        const method = Array.isArray( keyPath ) ? 'getIn' : 'get';
        const newValue = newState[ method ]( keyPath );
        const oldValue = oldState[ method ]( keyPath );

        newValues.push( newValue );
        oldValues.push( oldValue );

        if ( !isEqual( newValue, oldValue ) ) {
            changed = true;
        }
    } );

    if ( changed ) {
        callback.call( this, newValues, oldValues );
    }
}
